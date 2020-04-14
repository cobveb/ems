/* components/login/loginScreen.js */
export const LOGIN_SCREEN_TITLE = 'Logowanie';
/* components/login/loginForm,js */
export const USERNAME = 'Nazwa użytkownika';
export const PASSWORD = 'Hasło';
export const BUTTON_LOGIN = 'Zaloguj';
export const CREDENTIALS_EXPIRED = 'Hasło wymaga zmiany.';
export const TOGGLE_PASSWORD_VISIBILITY = 'Przełącz widoczność hasła';
/* components/login/changePasswordForm.js */
export const PASSWORD_NEEDS_CHANGE = 'hasło wymaga zmiany';
export const OLD_PASSWORD = 'Stare hasło';
export const NEW_PASSWORD = 'Nowe hasło';
export const RENEW_PASSWORD = 'Powtórz nowe hasło';
export const FORM_ERROR_MSG_INVALID_RENEW_PASSWORD = 'Niezgodne nowe hasła';
export const FORM_ERROR_MSG_EQUAL_NEW_PASSWORD = 'Nowe hasło nie może być takie same jak obecne';
/* reducers/initialState.js, components/modules/modules/moduleList.js */
export const MODULES_TITLE = 'Moduły';
/* common/menu/appHeaderMenu.js */
export const HEADER_MENU_LOGOUT = 'Wyloguj';
/* components/modules/administrator/administrator.js */
export const MENU_INSTITUTION = 'Instytucja';
export const SUBMENU_INSTITUTION_DETAIL = 'Dane Instytucji';
export const SUBMENU_INSTITUTION_STRUCTURE = 'Struktura organizacyjna';
export const MENU_ACCESS_CONTROL = 'Kontrola dostępu';
export const SUBMENU_ACCESS_CONTROL_USERS = 'Użytkownicy';
export const SUBMENU_ACCESS_CONTROL_GROUPS = 'Grupy';
export const MENU_CONFIGURATIONS = 'Konfiguracja';
export const SUBMENU_CONFIGURATIONS_PARAMETERS = 'Parametry';
export const SUBMENU_CONFIGURATIONS_DICTIONARIES = 'Słowniki';
/* components/modules/administrator/institution.js */
export const INSTITUTION_BASIC_INFORMATION = 'Dane podstawowe';
export const INSTITUTION_BASIC_INFORMATION_CODE = 'Kod';
export const INSTITUTION_BASIC_INFORMATION_SHORT_NAME = 'Nazwa skrócona';
export const INSTITUTION_BASIC_INFORMATION_NAME = 'Nazwa';
export const INSTITUTION_BASIC_INFORMATION_NIP = 'NIP';
export const INSTITUTION_BASIC_INFORMATION_REGON = 'REGON';
export const INSTITUTION_ADDRESS = 'Dane adresowe';
export const INSTITUTION_ADDRESS_CITY = 'Miasto';
export const INSTITUTION_ADDRESS_ZIP_CODE = 'Kod pocztowy';
export const INSTITUTION_ADDRESS_STREET = 'Ulica';
export const INSTITUTION_ADDRESS_BUILDING = 'Numer budynku';
export const INSTITUTION_CONTACTS = 'Dane kontaktowe';
export const INSTITUTION_CONTACTS_PHONE = 'Telefon';
export const INSTITUTION_CONTACTS_FAX = 'Fax';
export const INSTITUTION_CONTACTS_EMAIL = 'Email';
/* components/modules/administrator/structure.js */
export const STRUCTURE_CONFIRM_DELETE_MESSAGE = 'Jednostka Organizacyjna zostanie usunięta. Czy kontynuować?';
export const STRUCTURE_SHOW_INACTIVE = 'Uwzględniaj nieaktywne:';
/* components/modules/administrator/organizationUnit.js */
export const ORGANIZATION_UNIT_TITLE_ADD = 'Dodawanie jednostki organizacyjnej';
export const ORGANIZATION_UNIT_TITLE_EDIT = 'Edycja jednostki organizacyjnej - ';
/* components/modules/administrator/organizationUnitForm.js */
export const ORGANIZATION_UNIT_ACTIVE = 'Aktywna:';
export const ORGANIZATION_UNIT_COORDINATOR = 'Koordynator:';
/* components/modules/administrator/users.js */
export const USERS_SEARCH_USERNAME = 'Nazwa użytkownika';
export const USERS_SEARCH_SURNAME = 'Nazwisko';
export const USERS_SEARCH_NAME = 'Imię';
export const USER_TABLE_HEAD_ROW_CODE = 'Kod';
export const USER_TABLE_HEAD_ROW_USERNAME = 'Nazwa';
export const USER_TABLE_HEAD_ROW_SURNAME = 'Nazwisko';
export const USER_TABLE_HEAD_ROW_NAME = 'Imię';
export const USER_TABLE_HEAD_ROW_ACTIVE = 'Aktywny';
export const USER_TABLE_HEAD_ROW_LOCKED = 'Zablokowany';
export const USER_CONFIRM_DELETE_MESSAGE = 'Użytkownik zostanie usunięty. Czy kontynuować?';
/* components/modules/administrator/user.js */
export const USER_TITLE_ADD = 'Użytkownik - Nowy użytkownik';
export const USER_TITLE_EDIT = 'Użytkownik - ';
export const USER_BASIC_INFORMATION = 'Dane podstawowe';
export const USER_PERMISSIONS = 'Uprawnienia';
export const USER_GROUPS = 'Grupy';
/* components/modules/administrator/userForm.js */
export const USER_BASIC_INFORMATION_NAME = 'Imię';
export const USER_BASIC_INFORMATION_SURNAME = 'Nazwisko';
export const USER_BASIC_INFORMATION_OU = 'Jednostka organizacyjna';
export const USER_ACCOUNT = 'Konto';
export const USER_ACCOUNT_ACTIVE = 'Aktywny:';
export const USER_ACCOUNT_LOCKED = 'Zablokowany:';
export const USER_ACCOUNT_CODE = 'Kod';
export const USER_ACCOUNT_USERNAME = 'Nazwa użytkownika';
export const USER_PASSWORD = 'Hasło';
export const USER_PASSWORD_CHANGE = 'Hasło wymaga zmiany:';
export const USER_PASSWORD_NEW = 'Nowe hasło';
/* components/modules/administrator/userGroupsForm.js */
export const USER_GROUPS_ALL_GROUPS = 'Wszystkie grupy:';
export const USER_GROUPS_ALL_USER_GROUPS = 'Przypisane grupy:';
export const USER_GROUPS_TABLE_HEAD_ROW_CODE = 'Kod';
export const USER_GROUPS_TABLE_HEAD_ROW_NAME = 'Nazwa';
/* components/modules/administrator/groups.js */
export const GROUPS_TABLE_HEAD_ROW_CODE = 'Kod';
export const GROUPS_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const GROUPS_SEARCH_CODE_NAME = 'Kod / Nazwa';
/* components/modules/administrator/group.js */
export const GROUP_CREATE_NEW_GROUP = 'Nowa grupa';
export const GROUP_BASIC_INFORMATION = 'Dane podstawowe';
export const GROUP_BASIC_INFORMATION_CODE = 'Kod';
export const GROUP_BASIC_INFORMATION_NAME = 'Nazwa';
export const GROUP_USERS = 'Użytkownicy';
export const GROUP_PERMISSIONS = 'Uprawnienia';
/* components/modules/administrator/GroupUsersForm.js */
export const GROUP_USERS_ALL_USERS = 'Wszyscy użytkownicy:';
export const GROUP_USERS_USERS_IN_GROUP = 'Przypisani użytkownicy:';
/* components/modules/administrator/AcPermissionsForm.js */
export const GROUP_PERMISSIONS_SEARCH_AC_OBJECTS_NAME = 'Nazwa';
export const GROUP_PERMISSIONS_SEARCH_PRIVILEGES_CODE_NAME = 'Kod / Nazwa';
export const GROUP_PERMISSIONS_TABLE_PRIVILEGES_LABEL = 'Lista uprawnień:';
export const GROUP_PERMISSIONS_TABLE_PRIVILEGES_HEAD_ROW_CODE = 'Kod';
export const GROUP_PERMISSIONS_TABLE_PRIVILEGES_HEAD_ROW_NAME = 'Nazwa';
export const GROUP_PERMISSIONS_TABLE_OBJECTS_LABEL = 'Lista obiektów:';
export const GROUP_PERMISSIONS_TABLE_OBJECTS_HEAD_ROW_NAME = 'Nazwa';
export const GROUP_CONFIRM_DELETE_MESSAGE = 'Grupa zostanie usunięta. Czy kontynuować?';
/* components/modules/administrator/parameters.js */
export const PARAMETERS_SEARCH_CODE = 'Kod / Nazwa';
export const PARAMETERS_SEARCH_CATEGORY = 'Kategoria';
export const PARAMETERS_SEARCH_SECTION = 'Sekcja';
export const PARAMETERS_TABLE_HEAD_ROW_CATEGORY = 'Kategoria';
export const PARAMETERS_TABLE_HEAD_ROW_SECTION = 'Sekcja';
export const PARAMETERS_TABLE_HEAD_ROW_CODE = 'Kod';
export const PARAMETERS_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const PARAMETERS_TABLE_HEAD_ROW_VALUE = 'Wartość';
/* components/modules/administrator/parameterDetails.js */
export const PARAMETER_DETAILS_TITLE = 'Szczegóły parametru konfiguracyjnego';
export const PARAMETER_BASIC_INFORMATION = 'Dane podstawowe';
export const PARAMETER_CATEGORY = 'Kategoria';
export const PARAMETER_SECTION= 'Sekcja';
export const PARAMETER_CODE= 'Kod';
export const PARAMETER_NAME= 'Nazwa';
export const PARAMETER_DESCRIPTION = 'Opis';
export const PARAMETER_VALUE = 'Wartość';
/* components/modules/coordinator/coordinator.js */
export const COORDINATOR = "Koordynator";
/* Commons sections */
export const BUTTON_SAVE = 'Zapisz';
export const BUTTON_CANCEL = 'Anuluj';
export const BUTTON_CLOSE = 'Zamknij';
export const BUTTON_OK = 'Ok';
export const BUTTON_YES = 'Tak';
export const BUTTON_NO = 'Nie';
export const BUTTON_DELETE = 'Usuń';
export const BUTTON_EDIT= 'Edytuj';
export const BUTTON_ADD = 'Dodaj';
export const BUTTON_PREVIEW = 'Podgląd';
export const BUTTON_POSITIONS = 'Pozycje';
export const TEXTFIELD_SEARCH = 'Szukaj';
export const DRAWER_MENU_SHOW = 'Pokaż';
export const DRAWER_MENU_HIDE = 'Ukryj';
export const APP_HEADER_HOME_BUTTON = 'Start';
export const SELECT_FIELD_ALL = 'Wszystkie';
export const TRANSFER_LIST_ALL_RIGHT = '>>';
export const TRANSFER_LIST_SELECTED_RIGHT = '>';
export const TRANSFER_LIST_ALL_LEFT = '<<';
export const TRANSFER_LIST_SELECTED_LEFT = '<';
/* common/modalDialog.js */
export const MODAL_DIALOG_ERROR = 'Błąd';
export const MODAL_DIALOG_INFORMATION = 'Informacja';
export const MODAL_DIALOG_WARNING = 'Ostrzeżenie';
export const MODAL_DIALOG_CONFIRM = 'Potwierdzenie';
/* Form error names */
export const FORM_ERROR_MSG_REQUIRED_FIELD = 'Pole wymagane';
export const FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS = 'Nieprawidłowy adres email';
export const FORM_ERROR_MSG_INVALID_NIP = 'Nieprawidłowy numer NIP';
export const FORM_ERROR_MSG_INVALID_REGON= 'Nieprawidłowy numer REGON';
export const FORM_ERROR_MSG_INVALID_CHAR = 'Pole zawiera niedozwolone znaki';
export const FORM_ERROR_MSG_INVALID_ZIP_CODE = 'Nieprawidłowy kod pocztowy';
export const FORM_ERROR_MSG_INVALID_PHONE_NUMBER = 'Nieprawidłowy numer telefonu';
export const FORM_ERROR_MSG_INVALID_FAX_NUMBER = 'Nieprawidłowy numer fax';