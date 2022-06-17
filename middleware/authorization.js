module.exports = async (req,res,next) => {
    try{
        const role = req.user.role
        if(role === "user") res.json("only admin can do this")
        next()
    }
    catch(error){
       next(error)
    }
}