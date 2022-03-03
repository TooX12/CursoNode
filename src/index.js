import app from './app'
import './dbconect'

//Server Config
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log(`Node server running on http://localhost:${PORT}`);
});/**Comentario para que actualice heroku */