const pool = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.signup = async (req, res) => {
    const {email, username, password} = req.body;
    try{
        const existingUser = await pool.query('Select * from users where users_username = $1', [username])
        if(existingUser.rows.length > 0){
            return res.status(400).json({error : 'User already exists'});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query('INSERT INTO users (users_email, users_username, users_password) VALUES ($1, $2, $3) RETURNING users_id, users_username',
            [email, username, hashedPassword]
        );
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    }catch(e){
        res.status(500).json({ error: 'Server error' });
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body;

    try{
        const result = await pool.query('select * from users where users_username = $1', [username]);
        if((await result).rows.length === 0){
            return res.status(400).json({error : 'Invalid username!!!'})
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.users_password)
        if(!match){
            return res.status(400).json({error : 'Incorrect Password'})
        }
        const token = jwt.sign({userId : user.users_id}, process.env.JWT_SECRET, { expiresIn: '2h' })
        res.json({ message: 'Login successful', token });
    } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}