import {
  AsyncStorage
} from 'react-native';

MOPS = require('../config/mops');
let _ = require('lodash');

/* uploades array of favourites to AsyncStorage */
uploadFavourites = async (favourites) => {
    await AsyncStorage.setItem('mopsik_favouriteMOPs',
      JSON.stringify(favourites));
};

/* deletes mop with id=id from favourites (in AsyncStorage and global variables) */
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

/*
 * get favourites from AsyncStorage, update variables
 * favouriteMOPs is a list of ids
 * favouriteMOPsmapped is list of whole MOP objects (dicts with all parameters)
 */
downloadFavourites = () => {
  AsyncStorage.getItem('mopsik_favouriteMOPs').then((response) => {
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
