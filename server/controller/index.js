const Users = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail, forgotPassword} = require('./sendMail');

const {google} = require('googleapis')
const {OAuth2} = google.auth
const fetch = require('node-fetch')
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const { CLIENT_URL } = process.env;

const userControl = {

    register: async (req, res) => {
        try {
            const { name, number, email, password, role } = req.body;
            const userEmail = await Users.findOne({email});
            const passwordHash = await bcrypt.hash(password, 12);
            
            const newUser = {
                name, number, email, password: passwordHash
            }

            const activation_token = createActivationToken(newUser);
            const url = `${CLIENT_URL}/user/activate/${activation_token}` ;
            sendEmail(email, url);

            if (!name || !password) {
                res.status(400);
                res.json({
                    msg: "One of the above parameters is not supplied!!"
                });
            }

            if (!validateEmail(email)) {
                res.status(400);
                res.json({
                    msg: "please provide a proper email address"
                });
            }

            if (userEmail) {
                res.status(400);
                res.json({
                    msg: "This account already exists, please login with your existing credentials or use a seperate email id"
                });
            }

            if (!validateNumber(number)) {
                res.status(400);
                res.json({
                    msg: "please provide your phone number with either +44 or 0 prefixed!!"
                });
            }

            if (password.length < 6) {
                res.status(400);
                res.json({
                    msg: "Password must be atleast 6 characters long!!"
                });
            }

            res.json({msg: "Registration Successful! Please click on the link provided in the email sent to you!!"})

        } catch (err) {
            res.sendStatus(500);
            console.log(err);
            
        }
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name, number, email, password} = user

            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                name, number, email, password
            })

            await newUser.save()

            res.json({msg: "Congratulations!! Your account has been activated! You can now register for the upcoming mass"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body;
            const user = await Users.findOne({email});
            if(!user) return res.status(400).json({msg: "This email does not exist."});

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."});

            const refresh_token = createRefreshToken({id: user._id});

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })

            res.json({msg: "Login successful!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, 
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            forgotPassword(email, url, "Reset your password")
            res.json({msg: "A new password has been generated and sent to you, please check your email."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password} = req.body;
            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate({_id: req.user.id}, {
                password: passwordHash
            })

            res.json({msg: "Password successfully changed! Login with your email id and the new password!!"})

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {
            const users = await Users.find().select('-password')
            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const {name, avatar, number} = req.body
            await Users.findOneAndUpdate({_id: req.user.id}, {
                name, avatar, number
            })

            res.json({msg: "Update successful!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const {role} = req.body
            await Users.findOneAndUpdate({_id: req.params.id}, {
                role
            })

            res.json({msg: "Details updated successfully!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await Users.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted successfully!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    googleLogin: async (req, res) => {
        try {
            const {tokenId} = req.body

            const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})
            
            const {email_verified, email, name, picture} = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const {accessToken, userID} = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            
            const data = await fetch(URL).then(res => res.json()).then(res => {return res})

            const {email, name, picture} = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

                const refresh_token = createRefreshToken({id: user._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()
                
                const refresh_token = createRefreshToken({id: newUser._id})
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7*24*60*60*1000 // 7 days
                })

                res.json({msg: "Login success!"})
            }


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
};

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateNumber(number) {
    const num = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    return num.test(number);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'});
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
}


module.exports = userControl;