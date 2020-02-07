const  Models  = require('../models')


module.exports = authenticateUser = (req,res,next) => {
    const token = req.headers['x-auth']
    if (token) {
         Models.AuthToken.findOne({ where: { token } })
            .then((user) => {
                if(user) {   
                req.token = token
                const id = user.dataValues.UserId
                Models.User.findOne({ where: {id} })
                    .then((userData)=>{
                        req.user = userData.dataValues
                        next()
                    })
                    .catch(err=>console.log(err))
                } else {
                    res.status('401').send('Invalid token')
                }      
            })
            .catch((err) => {
                res.send(err)
            })
    }
    else {
        res.json({error : "no token provided"})
    }
 
} 