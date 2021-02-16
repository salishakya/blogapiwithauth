const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file , cb) {
        cb(null , '../blogapiwithauth/public');
    },
    filename : function(req,file,cb) {
        cb(null , file.originalname);
    }
  });
  
  const fileFilter = (req , file , cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null , true);
    } else {
    cb(new Error('must be jpeg or png') , false);
    }
  }
  
  const upload = multer({
    storage : storage ,
    limits : {
        fileSize : 1024 * 1024 * 20
    },
    fileFilter : fileFilter
  });

module.exports = upload ;