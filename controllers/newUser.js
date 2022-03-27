const moongose = require('mongoose');
const bcrycpt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new moongose.Schema({
    name: {
        type: String, require: true, unique:true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, require: true
    }
});

UserSchema.pre('save', function (next) {
  
    if (this.isNew || this.isModified('password')) {
        const document = this;
        bcrycpt.hash(document.password, saltRounds, (err, hashedPassword) => {
            if (err) {
                next(err);
                
            }
           
            else {
                document.password = hashedPassword ;
                next();
            }
            
        });
    } else {
        next();
    }
});


module.exports = moongose.model('Usuario', UserSchema);
