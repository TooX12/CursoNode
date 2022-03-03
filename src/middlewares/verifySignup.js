import Employee from "../models/employee"

export const checkDuplicateEmployee = async (req,res,next)=>{
    const employee= await Employee.findOne({email:req.body.email})
    if(employee) return res.status(400).json({message:"The employee already exist"})
    next();

}