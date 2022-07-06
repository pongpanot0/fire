/* const auth = require("../auth")
app.post('/signup',async(req,res)=>{
    const user = {
        email:req.body.email,
        password:req.body.email
    }
    const userResponse = await User.auth().createUser({
        email:user.email,
        password:user.password,
        emailVerified:false,
        disable:false
    });
    res.json(userResponse)
}) */