exports.checkValidWhenSignIn = (req, res, next) => {
  if(!(req.body.username || req.body.password)) {
    return res.status(401).send({ message: 'please enter username and password!' });
  }

  next();
}
