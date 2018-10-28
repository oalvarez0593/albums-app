'use strict';
var path = require('path');
var fs = require('fs');
var Image = require('../models/image');
var Album = require('../models/album');

function getImage(request, response) {
  var imageId = request.params.id;
  Image.findById(imageId, (err, image) => {
    if (err) {
      response.status(500).send({
        message: 'Error al recuperar la imágen'
      });
    } else {
      if (!image) {
        response.status(404).send({
          message: 'La imagen no existe'
        });
      } else {
        Album.populate(image, {
          path: 'album'
        }, (err, image) => {
          if (err) {
            response.status(500).send({
              message: 'Error en la petición'
            });
          } else {
            response.status(200).send({
              image
            });
          }
        });
      }
    }
  });
}

function getImages(request, response) {
  var albumId = request.params.album;
  if (!albumId) {
    //sacar todas las imagenes de la BD
    Image.find({}).sort('title').exec((err, images) => {
      if (err) {
        response.status(500).send({
          message: 'Error en la petición'
        });
      } else {
        if (!images) {
          response.status(404).send({
            message: 'No existen imágenes'
          });
        } else {
          Album.populate(images, {
            path: 'album'
          }, (err, images) => {
            if (err) {
              response.status(500).send({
                message: 'Error en la petición'
              });
            } else {
              response.status(200).send({
                images
              });
            }
          });
        }
      }
    });
  } else {
    //sacar todaas las images del album
    Image.find({
      album: albumId
    }).sort('title').exec((err, images) => {
      if (err) {
        response.status(500).send({
          message: 'Error en la petición'
        });
      } else {
        if (!images) {
          response.status(404).send({
            message: 'No existen imágenes'
          });
        } else {
          Album.populate(images, {
            path: 'album'
          }, (err, images) => {
            if (err) {
              response.status(500).send({
                message: 'Error en la petición'
              });
            } else {
              response.status(200).send({
                images
              });
            }
          });
        }
      }
    });
  }
}

function saveImage(request, response) {
  var image = new Image();
  var params = request.body;
  image.title = params.title;
  image.picture = null;
  image.album = params.album;
  image.save((err, imageStored) => {
    if (err) {
      response.status(500).send({
        message: 'Error al guardar la imágen'
      });
    } else {
      if (!imageStored) {
        response.status(404).send({
          message: 'No se ha guardado la imágen'
        });
      } else {
        response.status(200).send(imageStored);
      }
    }
  });
}

function updateImage(request, response) {
  var imageId = request.params.id;
  var params = request.body;
  Image.findByIdAndUpdate(imageId, params, (err, imageUpdate) => {
    if (err) {
      response.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if (!imageUpdate) {
        response.status(404).send({
          message: 'No se ha actualizado la imágen'
        });
      } else {
        response.status(200).send({
          imageUpdate
        });
      }
    }
  });
}

function deleteImage(request, response) {
  var imageId = request.params.id;
  Image.findByIdAndRemove(imageId, (err, imageRemoved) => {
    if (err) {
      response.status(500).send({
        message: 'No se ha podido eliminar la imagen'
      });
    } else {
      if (!imageRemoved) {
        response.status(404).send({
          message: 'No existe la imagen para eliminar'
        });
      } else {
        response.status(200).send({
          imageRemoved
        });
      }
    }
  });
}

function uploadImage(request, response) {
  var imageId = request.params.id;
  var file_name = 'No subido ...';
  if (request.files) {
    var file_path = request.files.image.path;
    var file_split = file_path.split('/');
    var file_name = file_split[1];
    Image.findByIdAndUpdate(imageId, {
      picture: file_name
    }, (err, imageUpdated) => {
      if (err) {
        response.status(500).send({
          message: 'Error al cargar la imágen'
        });
      } else {
        if (!imageUpdated) {
          response.status(404).send({
            message: 'No hay ninguna imágen para cargar'
          });
        } else {
          response.status(200).send({
            imageUpdated
          });
        }
      }
    })
  }
}

function getImageFile(request, response) {
  var imageFile = request.params.imageFile;
  fs.exists('./uploads/' + imageFile, (exists) => {
    if (exists) {
      response.sendFile(path.resolve('./uploads/' + imageFile));
    } else {
      response.status(200).send({
        message: 'No existe la imágen!'
      });
    }
  });
}
module.exports = {
  getImage,
  getImages,
  saveImage,
  updateImage,
  deleteImage,
  uploadImage,
  getImageFile
};