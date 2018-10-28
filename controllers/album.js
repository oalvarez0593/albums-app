'use strict'
var Album = require('../models/album');

function getAlbum(request, response) {
  var albumId = request.params.id;
  console.log(albumId);
  Album.findById(albumId, (err, album) => {
    if (err) {
      console.log(err);
      response.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if (!album) {
        response.status(404).send({
          message: 'El album no existe'
        });
      } else {
        response.status(200).send({
          album
        });
      }
    }
  });
}

function getAlbums(request, response) {
  Album.find({}, (err, albums) => {
    if (err) {
      response.status(500).send({
        message: 'Error en la petición'
      });
    } else {
      if (!albums) {
        response.status(404).send({
          message: 'No existen Albums'
        });
      } else {
        response.status(200).send({
          albums
        });
      }
    }
  });
}

function saveAlbum(request, response) {
  var album = new Album();
  var params = request.body;
  album.title = params.title;
  album.description = params.description;
  album.save((err, albumStored) => {
    if (err) {
      response.status(500).send({
        message: 'Error al guardar el album'
      });
    } else {
      if (!albumStored) {
        response.status(404).send({
          message: 'No se ha guardado el album.'
        });
      } else {
        response.status(200).send(albumStored);
      }
    }
  });
}

function updateAlbum(request, response) {
  var albumId = request.params.id;
  var params = request.body;
  Album.findByIdAndUpdate(albumId, params, (err, albumUpdated) => {
    if (err) {
      response.status(500).send({
        message: 'Error al actualizar el album'
      });
    } else {
      if (!albumUpdated) {
        response.status(404).send({
          message: 'No se ha actualizado el album'
        });
      } else {
        response.status(200).send(albumUpdated);
      }
    }
  });
}

function deleteAlbum(request, response) {
  var albumId = request.params.id;
  Album.findByIdAndRemove(albumId, (err, albumDeleted) => {
    if (err) {
      response.status(500).send({
        message: 'Error al eliminar el album'
      });
    } else {
      if (!albumDeleted) {
        response.status(404).send({
          message: 'No se ha eliminado el album'
        });
      } else {
        response.status(200).send(albumDeleted);
      }
    }
  });
}
module.exports = {
  getAlbum,
  getAlbums,
  saveAlbum,
  updateAlbum,
  deleteAlbum
};