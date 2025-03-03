exports.takeId = (req, res) => {
    const token=req.headers.authorization
    jwt.verify(token.replace('Bearer ',''),config.jwtSecretKey,(err,decode)=>{
        if(err) return res.sendRes(0,err.toString())
        return decode.id
    })
};