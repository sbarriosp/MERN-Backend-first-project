const producto = require("../models/productos.model");
/*const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Features = require("../utils/Features");
const cloudinary = require("cloudinary");*/

// Crear producto por parte del empleado: 

exports.createProducto = catchAsyncErrors(async (req, res, next) => { //verificar esta variable de "catchAsyncErrors"
    let imagenes = [];
  
    if (typeof req.body.imagenes === "string") {
      imagenes.push(req.body.imagenes);
    } else {
      imagenes = req.body.imagenes;
    }
  
    const imagenesLinks = [];
  
    for (let i = 0; i < imagenes.length; i++) {
      const result = await cloudinary.v2.uploader.upload(imagenes[i], { //este es el proveedor de almacenamiento de imagines, sujeto a cambios
        folder: "img_front",  //sujeto a cambios de carpeta de origen.
      });
  
      imagenesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.imagenes = imagenesLinks;
    req.body.usuario = req.usuario.id;
  
    const Producto = await producto.create(req.body);
  
    res.status(201).json({
      success: true,
      producto,
    });
});

// Obtener todos los productos (Empleado)
exports.getAdminProductos = catchAsyncErrors(async (req, res, next) => {
    const producto = await producto.find();
  
    res.status(200).json({
      success: true,
      producto,
    });
});

// Obtener todos los productos (Usuario)
exports.getAllProductos = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 8;
  
    const productosCount = await producto.countDocuments();
  
    const feature = new Features(producto.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const Productos = await feature.query;
    res.status(200).json({
      success: true,
      producto,
      productosCount,
      resultPerPage,
    });
});

  // Actualizar Producto ---Empleados: 

exports.updateProducto = catchAsyncErrors(async (req, res, next) => {
    let Producto = await Producto.findById(req.params.id);
    if (!producto) {
      return next(new ErrorHandler("Product is not found with this id", 404));
    }
  
    let imagenes = [];
  
    if (typeof req.body.imagenes === "string") {
      imagenes.push(req.body.imagenes);
    } else {
      imagenes = req.body.imagenes;
    }
  
    if (imagenes !== undefined) {
      // Eliminar imagen de la pagina donde alojamos estas.
      for (let i = 0; i < producto.images.length; i++) {
        await cloudinary.v2.uploader.destroy(producto.images[i].public_id); //revisar ese servicio, y cambiar de ser necesario.
      }
  
      const imagenesLinks = [];
  
      for (let i = 0; i < imagenes.length; i++) {
        const result = await cloudinary.v2.uploader.upload(imagenes[i], { //revisar ese servicio, y cambiar de ser necesario.
          folder: "img-front", //carpeta de origen de los archivos.
        });
        imagenesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.imagenes = imagenesLinks;
    }
  
    producto = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useUnified: false,
    });
    res.status(200).json({
      success: true,
      product,
    });
});

// delete Producto

exports.deleteProducto = catchAsyncErrors(async (req, res, next) => {
    const Producto = await Producto.findById(req.params.id);
  
    if (!producto) {
      return next(new ErrorHandler("El producto no se encuenta en este dominio", 404));
    }
  
    // Deleting images from cloudinary, debe revisarse esto.
    for (let i = 0; 1 < producto.imagenes.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        producto.imagenes[i].public_id
    );
    }

    await producto.remove();

    res.status(200).json({
      success: true,
      message: "Producto eliminado exitósamente",
    });
});

// Detalles de producto individual. 

exports.getSingleProducto = catchAsyncErrors(async (req, res, next) => {
    const Producto = await Producto.findById(req.params.id);
    if (!producto) {
      return next(new ErrorHandler("El producto no se encontró con este ID", 404));
    }
    res.status(200).json({
      success: true,
      producto,
    });
  });
  
// Crear o actualizar una reseña, tambien lo veo opcional. 
exports.createProductoReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productoId } = req.body;
  
    const review = {
      usuario: req.usuario._id,
      nombre: req.usuario.name,
      /*rating: Number(rating),*/ //opcional
      comentario,
    };
  
    const Producto = await Producto.findById(productoId);
  
    const isReviewed = producto.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      producto.reviews.forEach((rev) => {
        if (rev.user.toString() === req.usuario._id.toString())
          (rev.rating = rating), (rev.comentario = comentario);
      });
    } else {
      producto.reviews.push(review);
      producto.numOfReviews = producto.reviews.length;
    }
  
    let avg = 0;
  
    producto.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    producto.ratings = avg / producto.reviews.length;
  
    await producto.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Obtener todos los reviews del producto

exports.getSingleProductoReviews = catchAsyncErrors(async (req, res, next) => {
  const producto = await Producto.findById(req.query.id);

  if (!producto) {
    return next(new ErrorHandler("El producto no se encontró con el ID", 404));
  }

  res.status(200).json({
    success: true,
    reviews: producto.reviews,
  });
});

// Delete Review --Admin
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const producto = await Producto.findById(req.query.productoId);

  if (!producto) {
    return next(new ErrorHandler("El producto no se encontró con el ID", 404));
  }

  const reviews = producto.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Producto.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// 
