import "@shoelace-style/shoelace/dist/components/avatar/avatar.js";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
import "@shoelace-style/shoelace/dist/components/menu/menu.js";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";

import { FirebaseAuthMenu } from "./firebase-auth-menu";
import { FirebaseAuthMenuTemplate as template } from "./firebase-auth-menu.template";
import { FirebaseAuthMenuStyles as styles } from "./firebase-auth-menu.styles";
import { CUSTOM_ELEMENT_PREFIX } from "../../../services/system";

FirebaseAuthMenu.define({
  name: `${CUSTOM_ELEMENT_PREFIX}-firebase-auth-menu`,
  template,
  styles,
});
