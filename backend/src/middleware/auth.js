const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas
exports.protect = async (req, res, next) => {
  let token;

  // Verificar si hay token en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Obtener token del header
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No estás autorizado para acceder a este recurso'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar usuario a req
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado / Token inválido' // More specific for this case
      });
    }
    req.user = user;
    next();
  } catch (err) {
    // Log the actual error for server-side debugging
    console.error("Error de autenticación:", err.message);
    return res.status(401).json({
      success: false,
      message: 'No estás autorizado para acceder a este recurso' // Keep generic for client
    });
  }
};
