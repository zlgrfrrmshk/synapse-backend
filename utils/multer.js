import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './storage/temp')
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Неподдерживаемый формат'), false)
  }
}

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})