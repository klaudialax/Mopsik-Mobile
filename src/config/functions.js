import {
  AsyncStorage
} from 'react-native';

MOPS = require('../config/mops');
let _ = require('lodash');


uploadFavourites = async (favourites) => {
    await AsyncStorage.setItem('favouriteMOPs',
      JSON.stringify(favourites));
};

deleteFavourite = (id) => {
    favs = MOPS.favouriteMOPs;
  idx = favs.indexOf(id);
  favs.splice(idx, 1);
  uploadFavourites(favs);
  let favourites_mapped = [];
  favs.map((fav, i) => {
     favourites_mapped.push(_.find(MOPS.mops, { id: fav }));
   });
 MOPS.favouriteMOPs = favs;
 MOPS.favouriteMOPsmapped = favourites_mapped;
};

downloadFavourites = () => {
  AsyncStorage.getItem('favouriteMOPs').then((response) => {
      if(response){
        favourites = JSON.parse(response);
      }
      else{
        favourites = [];
      }
      MOPS.favouriteMOPs = favourites;
      let favourites_mapped = [];
      favourites.map((fav, i) => {
         favourites_mapped.push(_.find(MOPS.mops, { id: fav }));
       });
      MOPS.favouriteMOPsmapped = favourites_mapped;
  }).done();
};

module.exports = {
  deleteFavourite: deleteFavourite,
  uploadFavourites: uploadFavourites,
  downloadFavourites: downloadFavourites,
};
