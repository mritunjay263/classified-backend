import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';

class JwtService {
  constructor() {}

  //sign token
  static sign(payload, expiry = "3600s", secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }

  //verify
  static verify(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
  
}

export default JwtService;