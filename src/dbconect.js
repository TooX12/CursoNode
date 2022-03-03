import mongoose from 'mongoose'

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.tw6pb.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(db=>console.log('DB is connected')) 
.catch(err=>console.error(err));