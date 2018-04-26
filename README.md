# Mopsik-Mobile
#### Aplikacja mobilna - system informowania kierowców o zajętości MOPów
\
![Mopsik](https://github.com/mopsy-team/Mopsik-Mobile/blob/master/src/images/logo_clear_all.png)

### Instalacja react-native
https://facebook.github.io/react-native/docs/getting-started.html

### Google API
Generowanie klucza do Google API: https://console.developers.google.com/apis/credentials

Klucz API należy umieścić w pliku: `mopsik_mobile/android/app/src/main/res/values/api-keys.xml`

### Instalacja pakietów
`npm install --save <nazwa_pakietu>`
(niektóre wymagają linkowania - szczegóły dostępne w dokumentacji każdego z pakietów)

| Pakiet | Dokumentacja |
| --- | --- |
| lodash | https://www.npmjs.com/package/lodash |
| react-native-elements | https://react-native-training.github.io/react-native-elements/ |
| react-native-maps | https://github.com/react-community/react-native-maps |
| react-native-restart | https://github.com/avishayil/react-native-restart |
| react-native-svg | https://github.com/react-native-community/react-native-svg |
| react-native-svg-circular-progress | https://github.com/stssoftware/react-native-svg-circular-progress |
| react-native-swipeout | https://github.com/dancormier/react-native-swipeout |
| react-native-table-component | https://github.com/Gil2015/react-native-table-component |
| react-native-vector-icons | https://github.com/oblador/react-native-vector-icons |
| react-navigation | https://reactnavigation.org |

### Uruchomienie
1. Uruchomienie emulatora Androida
2. W folderze z projektem:
	1. `react-native run-android`
	2. `react-native log-android` (opcjonalnie, wyświetla wszystkie console.log() z aplikacji)
