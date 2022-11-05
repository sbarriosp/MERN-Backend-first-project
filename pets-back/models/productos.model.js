const mongoose = require ("mongoose");

const productoSchema = new mongoose.Schema ({   
    nombre: {
        type: String, required: [true, "Ingrese un nombre de producto"], 
        trim:true, maxLength:[30, "El nombre del producto no debe exeder más de 30 caracteres"]
    },
    descripcion: {
        type: String, required: [true, "Ingrese la descripción del producto"], 
        trim:true, maxLength:[4000, "El nombre del producto no debe exeder más de 4000 caracteres"]
    },

    precio: {
        type: Number,
        required: [true, "Ingrese el precio del producto"],
        trim:true, maxLength:[15, "El nombre del producto no debe exeder más de 15 caracteres"]
    },

    oferta: {
        type: String, 
        maxlength: [4, "El descuento no puede exeder más de 4 caracteres"],
    },

    color: {
        type: String,
    },

    tamaño: {
        type: String,
    },

    /*ratings: {
        type: Number,
        default: 0,
    },*/

    imagenes:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            },
        }
    ],

    categoria: {
        type: String,
        required: [true, "Por favor defina la categoría del producto"],
    },

    inventario: {
        type: Number,
        required: [true, "Por favor indique el inventario existente de su producto"],
        maxLength: [4, "El inventario no puede exeder más de 4 caracteres"],
    },

    numeroresenas: {
        type: Number,
        default: 0
    },

    resenas: [
        {
            usuario: {
                type: mongoose.Schema.ObjectId , //pilas ahí puede que deba definir esta variable si genera error. 
                ref: "Usuario",
                required: true,
            },

            rating: {
                type: Number,
                required: true,
            },

            comentario: {
                type: String,
            },

            tiempo: {
                type: Date,
                default: Date.now()
            },
        },
    ],

    usuario: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        // required: true
    },

    realizadoeldia: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Producto", productoSchema);