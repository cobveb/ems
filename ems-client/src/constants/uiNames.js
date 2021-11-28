/* components/login/loginScreen.js */
export const LOGIN_SCREEN_TITLE = 'Logowanie';
/* components/login/loginForm,js */
export const USERNAME = 'Nazwa użytkownika';
export const PASSWORD = 'Hasło';
export const BUTTON_LOGIN = 'Zaloguj';
export const CREDENTIALS_EXPIRED = 'Hasło wymaga zmiany.';
export const TOGGLE_PASSWORD_VISIBILITY = 'Przełącz widoczność hasła';
export const WRONG_CREDENTIALS = 'Niepoprawna nazwa użytkownika lub hasło';
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
export const INSTITUTION_BASIC_INFORMATION_ROLE = 'Rola Jednostki Organizacyjnej';
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
export const ORGANIZATION_UNIT_COORDINATOR = 'Koordynator';
export const ORGANIZATION_UNIT_DIRECTOR = 'Dyrektor Pionu';
export const ORGANIZATION_UNIT_ECONOMIC = 'Dyrektor Ekonomiczny';
export const ORGANIZATION_UNIT_CHIEF = 'Dyrektor Naczelny';
export const ORGANIZATION_UNIT_COORDINATORS = 'Podlegli Koordynatorzy:';
export const ORGANIZATION_UNIT_COORDINATOR_CODE = 'Kod';
export const ORGANIZATION_UNIT_COORDINATOR_NAME = 'Nazwa';
export const ORGANIZATION_UNIT_DIRECTOR_REMOVE_COORDINATOR_MESSAGE = 'Koordynator przestanie być podległy Dyrektorowi. Czy kontunuować?';
/* components/modules/administrator/organizationUnitFormValid.js */
export const ORGANIZATION_UNIT_ROLE_CHIEF_EXISTS = 'Istnieje Jednostka Orgranizacyjna o roli Dyrektor Naczelny';
/* components/modules/administrator/ou/directorCoordinatorsForm.js */
export const ORGANIZATION_UNIT_DIRECTOR_COORDINATORS_TITLE = 'Nieprzypisani koorynatorzy';
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
/* components/modules/administrator/dictionaries.js */
export const DICTIONARIES_SEARCH_CODE_NAME = 'Kod / Nazwa';
/* components/modules/administrator/dictionary.js */
export const DICTIONARY_TITLE = 'Elementy słownika: ';
export const DICTIONARY_TABLE_HEAD_ROW_CODE = 'Kod';
export const DICTIONARY_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const DICTIONARY_TABLE_HEAD_ROW_ACTIVE = 'Aktywna';
export const DICTIONARY_CONFIRM_DELETE_MESSAGE = 'Pozycja zostanie usunięta. Czy kontynuować?';
/* components/modules/administrator/dictionaryItemDetails.js */
export const DICTIONARY_ITEM_DETAILS_ADD_TITLE = 'Nowa pozycja';
export const DICTIONARY_ITEM_DETAILS_EDIT_TITLE = 'Szczegóły pozycji: ';
/* components/modules/administrator/dictionaryItemForm.js */
export const DICTIONARY_ITEM_FORM_CODE = 'Kod';
export const DICTIONARY_ITEM_FORM_NAME = 'Nazwa';
export const DICTIONARY_ITEM_FORM_IS_ACTIVE = 'Aktywna';
/* components/modules/administrator/dictionaryItemFormValid.js */
export const DICTIONARY_ITEM_CODE_EXISTS = 'Pozycja o podanym kodzie istnieje';
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
/* components/modules/applicant.js */
export const MENU_APPLICATION = 'Wnioski';
export const SUBMENU_APPLICATIONS = 'Wnioski';
/* containers/modules/applicant/applicationsContainer.js */
export const APPLICATIONS_APPLICATION_STATUS_SAVED = 'Zapisany';
export const APPLICATIONS_APPLICATION_STATUS_SENT = 'Wysłany';
export const APPLICATIONS_APPLICATION_STATUS_CONSIDERED = 'Rozpatrywany';
export const APPLICATIONS_APPLICATION_STATUS_PARTIALLY_APPROVED = 'Częściowo zatwierdzony';
export const APPLICATIONS_APPLICATION_STATUS_APPROVED = 'Zatwierdzony';
export const APPLICATIONS_APPLICATION_STATUS_PARTIALLY_REALIZED = 'Częściowo realizowany';
export const APPLICATIONS_APPLICATION_STATUS_REALIZED = 'Realizowany';
export const APPLICATIONS_APPLICATION_STATUS_PARTIALLY_EXECUTED = 'Częściowo zrealizowany';
export const APPLICATIONS_APPLICATION_STATUS_EXECUTED = 'Zrealizowany';
export const APPLICATIONS_APPLICATION_STATUS_PARTIALLY_REJECTED = 'Częściowo odrzucony';
export const APPLICATIONS_APPLICATION_STATUS_REJECTED = 'Odrzucony';
/* components/modules/applicant/applications/applications.js */
export const APPLICATIONS_CONFIRM_DELETE_MESSAGE = 'Wniosek zostanie usunięty. Czy kontynuować?';
export const APPLICATIONS_CONFIRM_WITHDRAW_MESSAGE = 'Wniosek zostanie wycofany. Czy kontynuować?';
export const APPLICATIONS_SEARCH_NUMBER = 'Numer wniosku';
export const APPLICATIONS_SEARCH_STATUS = 'Status';
export const APPLICATIONS_SEARCH_DATE_FROM = 'Data wysłania od';
export const APPLICATIONS_SEARCH_DATE_TO = 'Data wysłania do';
export const APPLICATIONS_TABLE_HEAD_ROW_NUMBER = 'Numer wniosku';
export const APPLICATIONS_TABLE_HEAD_ROW_STATUS = 'Status';
export const APPLICATIONS_TABLE_HEAD_ROW_COORDINATOR = 'Koordynator';
export const APPLICATIONS_TABLE_HEAD_ROW_SEND_DATE = 'Data wysłania';
/* containers/modules/applicant/applicationContainer.js */
export const APPLICATIONS_APPLICATION_POSITION_STATUS_ADDED = 'Dodana';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_SAVED = 'Zapisana';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_SENT = 'Wysłana';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_CONSIDERED = 'Rozpatrywana';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_APPROVED = 'Zatwierdzona';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_REALIZED= 'Realizowana';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_EXECUTED= 'Zrealizowana';
export const APPLICATIONS_APPLICATION_POSITION_STATUS_REJECTED= 'Odrzucona';
/* components/modules/applicant/applications/application.js */
export const APPLICATION_CREATE_NEW_APPLICATION_TITLE = 'Nowy wniosek'
export const APPLICATION_EDIT_APPLICATION_TITLE = 'Edycja wniosku nr: '
export const APPLICATION_VIEW_APPLICATION_TITLE = 'Podgląd wniosku nr: '
/*components/modules/applicant/applications/forms/applicationForm.js*/
export const HEADING = 'Naglówek';
export const HEADING_NUMBER = 'Numer';
export const HEADING_STATUS = 'Status';
export const HEADING_CREATE_DATE = 'Data utworzenia';
export const HEADING_SEND_DATE = 'Data wysłania';
export const HEADING_COORDINATOR = 'Koordynator';
export const POSITIONS = 'Pozycje';
export const POSITIONS_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const POSITIONS_TABLE_HEAD_ROW_QUANTITY = 'Ilość';
export const POSITIONS_TABLE_HEAD_ROW_UNIT = 'Jednostka';
export const POSITIONS_TABLE_HEAD_ROW_STATUS = 'Status';
export const APPLICATION_CONFIRM_DELETE_POSITION_MESSAGE = 'Pozycja zostanie usunięta. Czy kontynuować?';
/*components/modules/applicant/applications/forms/applicationPositionForm.js*/
export const APPLICATION_POSITION_DETAILS_TITLE = 'Szczegóły pozycji wniosku';
export const APPLICATION_POSITION_DETAILS_POSITION_ID = 'Numer';
export const APPLICATION_POSITION_DETAILS_POSITION_NAME = 'Nazwa';
export const APPLICATION_POSITION_DETAILS_QUANTITY = 'Ilość';
export const APPLICATION_POSITION_DETAILS_UNIT = 'Jednostka';
export const APPLICATION_POSITION_DETAILS_STATUS = 'Status';
export const APPLICATION_POSITION_DETAILS_DESCRIPTION = 'Opis / uzasadnienie';
export const APPLICATION_POSITION_DETAILS_REJECTION_REASON = 'Powód odrzucenia';
/* components/modules/coordinator/coordinator.js */
export const COORDINATOR = "Koordynator";
export const COORDINATOR_MENU_APPLICATIONS = 'Obsługa wniosków';
export const COORDINATOR_SUBMENU_APPLICATIONS = 'Wnioski';
export const COORDINATOR_MENU_PLANS = 'Obsługa planów';
export const COORDINATOR_SUBMENU_PLANS = 'Plany';
export const COORDINATOR_MENU_REGISTERS = 'Rejestry';
export const COORDINATOR_MENU_PUBLIC_PROCUREMENT = 'Zamówienia publiczne';
export const COORDINATOR_SUBMENU_PUBLIC_APPLICATION = 'Wnioski';
export const COORDINATOR_SUBMENU_PUBLIC_REGISTER = 'Rejestr';
export const COORDINATOR_SUBMENU_PUBLIC_REALIZATION = 'Realizacja';
export const COORDINATOR_MENU_DICTIONARIES = 'Słowniki';
export const COORDINATOR_SUBMENU_DICTIONARIES = 'Słowniki';
/* containers/modules/coordinators/plans/plansContainer.js */
export const COORDINATOR_PLAN_STATUS = 'Status';
export const COORDINATOR_PLAN_STATUS_SAVED = 'Zapisany';
export const COORDINATOR_PLAN_STATUS_SENT = 'Wysłany';
export const COORDINATOR_PLAN_STATUS_ADOPTED = 'Rozpatrywany';
export const COORDINATOR_PLAN_STATUS_FORWARD = 'Przekazany';
export const COORDINATOR_PLAN_STATUS_AGREED = 'Uzgodniony';
export const COORDINATOR_PLAN_STATUS_APPROVED_ACCOUNTANT = 'Akceptacja - Główny księgowy';
export const COORDINATOR_PLAN_STATUS_APPROVED_PUBLIC_PROCUREMENT = 'Akceptacja ZP';
export const COORDINATOR_PLAN_STATUS_APPROVED_DIRECTOR = 'Akceptacja  - Dyrektor pionu';
export const COORDINATOR_PLAN_STATUS_APPROVED_ECONOMIC = 'Akceptacja - Dyrektor ekonomiczny';
export const COORDINATOR_PLAN_STATUS_APPROVED_CHIEF = 'Akceptacja - Dyrektor naczelny';
export const COORDINATOR_PLAN_STATUS_APPROVED = 'Zaakceptowany';
export const COORDINATOR_PLAN_STATUS_REALIZED = 'Realizowany';
export const COORDINATOR_PLAN_STATUS_EXECUTED = 'Zrealizowany';
export const COORDINATOR_PLAN_STATUS_UPDATE = 'Zaktualizowany';
export const COORDINATOR_PLAN_TYPE= 'Rodzaj';
export const COORDINATOR_PLAN_TYPE_FINANCIAL= 'Finansowy';
export const COORDINATOR_PLAN_TYPE_INVESTMENT= 'Inwestycyjny';
export const COORDINATOR_PLAN_TYPE_PUBLIC_PROCUREMENT= 'Zamówień publicznych';
/* components/modules/coordinator/plans/plans.js */
export const COORDINATOR_PLANS_TITLE = 'Plany';
export const COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR = 'Rok';
export const COORDINATOR_PLANS_TABLE_HEAD_ROW_TYPE = 'Rodzaj';
export const COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS = 'Status';
export const COORDINATOR_PLANS_TABLE_HEAD_ROW_UPDATE = 'Aktualizacja';
export const COORDINATOR_PLANS_CONFIRM_DELETE_MESSAGE = 'Plan zostanie usunięty. Czy kontynuować?';
export const COORDINATOR_PLANS_CONFIRM_WITHDRAW_MESSAGE = 'Wysłanie planu zostanie wycofane. Czy kontynuować?';
export const COORDINATOR_PLANS_CONFIRM_UPDATE_MESSAGE = 'Zostanie utworzona nowa wersja planu. Czy kontynuować?';
/* containers/modules/coordinators/plans/planContainer.js */
export const COORDINATOR_PLAN_POSITION_STATUS_ADDED = 'Dodana';
export const COORDINATOR_PLAN_POSITION_STATUS_SAVED = 'Zapisana';
export const COORDINATOR_PLAN_POSITION_STATUS_SENT = 'Wysłana';
export const COORDINATOR_PLAN_POSITION_STATUS_AGREED = 'Uzgodniona';
export const COORDINATOR_PLAN_POSITION_STATUS_ACCEPT = 'Zaakceptowana';
export const COORDINATOR_PLAN_POSITION_STATUS_CORRECT = 'Skorygowana';
export const COORDINATOR_PLAN_POSITION_STATUS_REALIZED = 'Realizowana';
export const COORDINATOR_PLAN_POSITION_STATUS_EXECUTED = 'Zrealizowana';
export const COORDINATOR_PLAN_POSITION_STATUS_UPDATED = 'Zaktualizowana';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_DELIVERY = 'Dostawa';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_SERVICE = 'Usługa';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_DO50 = 'Do 50 000 zl netto';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_D0130 = 'Powyżej 50 000 do 130 000 zl netto';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_PO130 = 'Powyżej 130 000 zł netto BZP';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_UE139 = 'Powyżej 139 000 euro netto UZP';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_WR = 'Wolna ręka';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_COVID = 'COVID';
/* components/modules/coordinator/plans/plan.js */
export const COORDINATOR_PLAN_CREATE_NEW_PLAN_TITLE = 'Nowy plan';
export const COORDINATOR_PLAN_EDIT_PLAN_TITLE = 'Edycja planu: ';
export const COORDINATOR_PLAN_UPDATE_PLAN_TITLE = 'Aktualizacja planu: ';
export const COORDINATOR_PLAN_BASIC_INFORMATION = 'Dane podstawowe';
export const COORDINATOR_PLAN_POSITIONS = 'Pozycje planu';
export const COORDINATOR_PLAN_PUBLIC_ORDERS_REGISTER = 'Rejestr zamówień publicznych';
/* components/modules/coordinator/plans/forms/planBasicForm.js */
export const COORDINATOR_PLAN_ACCEPT_PATH = 'Akceptacja planu';
export const COORDINATOR_PLAN_CONFIRM_SEND_MESSAGE = 'Plan zostanie wysłany. Czy kontynuować?';
export const COORDINATOR_PLAN_FORM_TYPE = 'Rodzaj planu';
export const COORDINATOR_PLAN_POSITIONS_HEAD_COSTS_TYPE = 'Rodzaje kosztu';
export const COORDINATOR_PLAN_POSITIONS_HEAD_COST_TYPE = 'Rodzaj kosztu';
export const COORDINATOR_PLAN_POSITIONS_HEAD_COST_NAME = 'Nazwa rodzaju kosztu';
export const COORDINATOR_PLAN_POSITIONS_HEAD_TASKS = 'Zadania';
export const COORDINATOR_PLAN_POSITIONS_HEAD_TASK = 'Zadanie';
export const COORDINATOR_PLAN_POSITIONS_HEAD_CATEGORY = 'Kategoria';
export const COORDINATOR_PLAN_FINANCIAL_REQUESTED_VALUE = 'Szacowana wartość planu brutto';
export const COORDINATOR_PLAN_FINANCIAL_AWARDED_VALUE = 'Przyznana wartość planu brutto';
export const COORDINATOR_PLAN_FINANCIAL_REALIZED_VALUE = 'Zrealizowana wartość planu brutto';
export const COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REQUESTED_VALUE = 'Orientacyjna wartość planu netto';
    export const COORDINATOR_PLAN_PUBLIC_PROCUREMENT_REALIZED_VALUE = 'Zrealizowana wartość planu netto';
/* components/modules/coordinator/plans/forms/planBasicFormValid.js */
export const COORDINATOR_PLAN_EXISTS = 'Dla wskazanego okresu istnieje plan ';
/* components/modules/coordinator/plans/forms/planPositionsForm.js */
export const COORDINATOR_PLAN_POSITIONS_CONFIRM_DELETE_POSITION_MESSAGE = 'Pozycja zostanie usunięta. Czy kontynuować?';
export const COORDINATOR_PLAN_POSITIONS_FINANCIAL_HEAD_NAME = 'Nazwa';
/* components/modules/coordinator/plans/forms/planPositionForm.js */
export const COORDINATOR_PLAN_POSITION_CREATE_DETAILS_TITLE = "Nowa pozycja planu"
export const COORDINATOR_PLAN_POSITION_EDIT_DETAILS_TITLE = "Edycja pozycji planu: "
export const COORDINATOR_PLAN_POSITION_PREVIEW_DETAILS_TITLE = "Szczególy pozycji: "
export const COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_NET = 'Kwota szacowana netto';
export const COORDINATOR_PLAN_POSITION_AMOUNT_REQUESTED_GROSS = 'Kwota szacowana brutto';
export const COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_NET = 'Kwota przyznana netto';
export const COORDINATOR_PLAN_POSITION_AMOUNT_AWARDED_GROSS = 'Kwota przyznana brutto';
export const COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_NET = 'Kwota zrealizowana netto';
export const COORDINATOR_PLAN_POSITION_AMOUNT_REALIZED_GROSS = 'Kwota zrealizowana brutto';
export const COORDINATOR_PLAN_POSITION_VAT = 'VAT';
/* components/modules/coordinator/plans/forms/planFinancialContentPositionForm.js */
export const COORDINATOR_PLAN_POSITION_FINANCIAL_COST_TYPES = 'Rodzaj kosztu';
export const COORDINATOR_PLAN_POSITION_FINANCIAL_DESCRIPTION = 'Opis / Uwagi';
export const COORDINATOR_PLAN_POSITION_COORDINATOR_DESCRIPTION = 'Uwagi Kooordynator';
export const COORDINATOR_PLAN_POSITION_HEAD_COORDINATOR_DESCRIPTION = 'UK';
export const COORDINATOR_PLAN_POSITION_MANAGEMENT_DESCRIPTION = 'Uwagi Dyrekcja';
export const COORDINATOR_PLAN_POSITION_HEAD_MANAGEMENT_DESCRIPTION = 'UD';
/* components/modules/coordinator/plans/forms/planFinancialContentPositionForm.js */
export const COORDINATOR_PLAN_POSITION_PUBLIC_COST_TYPE_EXISTS = 'Wybrany rodzaj kosztu istnieje w ramach planu'
export const COORDINATOR_PLAN_POSITION_PUBLIC_COST_TYPE_POSITIONS = 'Pozycje kosztu'
/* components/modules/coordinator/plans/forms/planFinancialPositionsForm.js */
export const COORDINATOR_PLAN_POSITION_FINANCIAL_CREATE_POSITION_DETAILS_TITLE = "Nowa pozycja";
export const COORDINATOR_PLAN_POSITION_FINANCIAL_EDIT_POSITION_DETAILS_TITLE = "Edycja pozycji: ";
export const COORDINATOR_PLAN_POSITION_FINANCIAL_PREVIEW_POSITION_DETAILS_TITLE = "Szczegóły pozycji: ";
export const COORDINATOR_PLAN_POSITION_FINANCIAL_UNIT_PRICE = 'Cena jednostkowa brutto';
export const COORDINATOR_PLAN_POSITION_FINANCIAL_AMOUNT_NET = 'Kwota netto';
export const COORDINATOR_PLAN_POSITION_FINANCIAL_AMOUNT_GROSS = 'Kwota brutto';
/* components/modules/coordinator/plans/forms/planPublicProcurementContentPositionForm.js */
export const COORDINATOR_PLAN_POSITION_PUBLIC_WRONG_ESTIMATION_TYPE_MSG = "Nieprawidłowy typ wartości szacunkowej? Czy kontynuować?";
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDERED_OBJECT = 'Przedmiot zamówienia';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDER_TYPE = 'Rodzaj zamówienia';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP = 'Grupa asortymentowa';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUPS = 'Grupy asortymentowe planu zamówień publicznych';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE = 'Tryb udzielenia';
export const COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_NET = 'Orientacyjna kwota netto';
export const COORDINATOR_PLAN_POSITION_PUBLIC_INITIATION_TERM = 'Termin wszczęcia';
export const COORDINATOR_PLAN_POSITION_PUBLIC_COMMENTS = 'Uwagi';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP_POSITIONS = 'Pozycje grupy asortymentowej';
/* components/modules/coordinator/plans/forms/planPublicProcurementContentPositionFormValid.js */
export const COORDINATOR_PLAN_POSITION_PUBLIC_ASSORTMENT_GROUP_EXISTS = 'Wybrana grupa asotymentowa istnieje w ramach planu'
/* components/modules/coordinator/plans/forms/PlanInvestmentContentPositionForm.js */
export const COORDINATOR_PLAN_POSITION_INVESTMENT_CATEGORY = 'Kategoria';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_APPLICATION = 'Zastosowanie';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_SUBSTANTIATION = 'Uzasadnienie';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_FUNDING_SOURCES = 'Źródła finansowania';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_TARGET_UNITS = 'Jednostki docelowe';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_REMOVE_TARGET_UNITS_MSG = 'Jednostka/ki zostaną usunięte czy kontynuować?';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_SOURCES = 'Źródło finansowania';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_REALIZATION_DATE = 'Data realizacji';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_UNIT = 'Jednostka';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_NET = 'Kwota zadania netto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_TASK_GROSS = 'Kwota zadania brutto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_AWARDED_GROSS = 'Przyznana kwota zadania brutto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_NET = 'Kwota wydatku netto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_GROSS = 'Kwota wydatku brutto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_EXPENSES_PLAN_AWARDED_GROSS = 'Przyznana kwota wydatku brutto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_HEAD_REALIZED_PLAN_GROSS = 'Wydatki poniesione brutto';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_DELETE_TARGET_UNIT_MSG = 'Jednostka docelowa zostanie usunięta. Czy kontynuować?';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_DELETE_SOURCE_MSG = 'Źródło finansowania zostanie usunięte. Czy kontynuować?';
/* components/modules/coordinator/plans/forms/PlanInvestmentContentPositionFormValid.js */
export const COORDINATOR_PLAN_POSITION_INVESTMENT_REALIZATION_DATE_INVALID = 'Data realizacji niezgodna z rokiem planu';
/* components/modules/coordinator/plans/forms/planInvestmentPositionsForm.js */
export const COORDINATOR_PLAN_POSITION_INVESTMENT_CREATE_POSITION_DETAILS_TITLE = 'Nowa jednostka docelowa';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_EDIT_POSITION_DETAILS_TITLE = 'Edycja jednostki docelowej: ';
export const COORDINATOR_PLAN_POSITION_INVESTMENT_TARGET_UNIT = 'Jednostka Organizacyjna';
/* components/modules/coordinator/plans/forms/planInvestmentPositionsFormValid.js */
export const COORDINATOR_PLAN_POSITION_INVESTMENT_TARGET_UNIT_EXISTS = 'Jednostka Organizacyjna istnieje w ramach zadania';
/* components/modules/coordinator/plans/forms/PlanFoundingSourcesForm.js */
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_CREATE_SOURCES_DETAILS_TITLE = "Nowe źródło finansowania";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_EDIT_SOURCES_DETAILS_TITLE = "Edycja źródła finansowania: ";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_TASK = "Wartość zadania";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSE = "Wartość wydatku";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_NET = 'Uzgodniona kwota zadania netto';
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_GROSS = 'Uzgodniona kwota zadania brutto';
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AGREED_GROSS = 'Niewykorzystana / przekroczona kwota brutto dla źródła w ramach zadania';
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_NET = 'Uzgodniona kwota wydatku netto';
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_GROSS = 'Uzgodniona kwota wydatku brutto';
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AGREED_GROSS = 'Niewykorzystana kwota brutto dla źródła w ramach wydatku';
/* components/modules/coordinator/plans/forms/PlanFoundingSourcesFormValid.js */
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_SOURCE_EXISTS = "Źródło finansowania istnieje w ramach pozycji";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_EXPENSES_PLAN_GROSS = "Kwota wydatku większa niż kwota zadania";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_AWARDED_GROSS = "Kwota zadania dla jednostki większa niż kwota zadania dla pozycji w planie";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_SOURCE_EXPENSES_AWARDED_GROSS = "Kwota wydatku dla jednostki większa niż kwota wydatku dla pozycji w planie";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_UNITS_SOURCE_AWARDED_GROSS = "Suma kwota zadania źródła dla jednostek większa niż kwota wydatku dla pozycji w planie";
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_INVALID_UNITS_SOURCE_EXPENSES_AWARDED_GROSS = "Suma kwota wydatku dla jednostek większa niż kwota wydatku dla pozycji w planie";
/* components/modules/coordinator/plans/forms/planInvestmentPositionTargetUnitsForm.js */
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_TARGET_UNITS_TITLE = 'Jednostki organizacyjne';
export const COORDINATOR_PLAN_INVESTMENTS_POSITION_TARGET_UNITS_SEARCH = 'Kod / Nazwa';
/* components/modules/coordinator/plans/forms/planUpdateForm.js */
export const COORDINATOR_PLAN_UPDATE_PUBLIC_PROCUREMENT_VALUE = 'Przyznana wartość planu netto przed korektą';
export const COORDINATOR_PLAN_UPDATE_PUBLIC_PROCUREMENT_CORRECT_VALUE = 'Wartość planu netto po korekcie';
export const COORDINATOR_PLAN_UPDATE_PLAN_AWARDED_VALUE = 'Przyznana wartość planu brutto przed korektą';
export const COORDINATOR_PLAN_UPDATE_PLAN_AWARDED_CORRECT_VALUE = 'Wartość planu brutto po korekcie';
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECT = "Korekta";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECTED = "Kwota po korekcie";
export const COORDINATOR_PLAN_UPDATE_PUBLIC_POSITION_VALUE = 'Przyznana kwota netto';
export const COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_CORRECTED = 'Kwota wydatku po korekcie';
/* components/modules/coordinator/plans/planUpdateFinancialContentPositionForm.js */
export const COORDINATOR_PLAN_UPDATE_POSITION_DETAILS_TITLE = "Szczegóły pozycji planu: ";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_BEFORE_CORRECTED_NET = "Kwota przyznana netto przed korektą";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_BEFORE_CORRECTED_GROSS = "Kwota przyznana brutto przed korektą";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AFTER_CORRECTED_NET = "Kwota netto po korekcie";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AFTER_CORRECTED_GROSS = "Kwota brutto po korekcie";
/* components/modules/coordinator/plans/planUpdateFinancialContentPositionFormValid.js */
export const COORDINATOR_PLAN_UPDATE_PLAN_AMOUNT_AWARDED_EXCEEDED = "Przekroczono zatwierdzoną wartość planu";
/* containers/modules/coordinator/publicProcurement/applications/applicationsContainer.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_SAVE = 'Zapisany';
/* components/modules/coordinator/publicProcurement/applications/applications.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_TITLE = 'Wnioski o udzielenie zamówień publicznych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_ORDER_VALUE_NET = 'Wartość wniosku netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER = 'Numer wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_DELETE_MSG = 'Wniosek zostanie usunięty. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_WITHDRAW_MSG = 'Wniosek zostanie wycofany. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_WITHDRAW_REALISATION_MSG = 'Realizacja wniosku zostanie anulowana. Modyfikacja wniosku będzie niemożliwa. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WITHDRAW = 'Wycofaj';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WITHDRAW_REALISATION = 'Wycofaj realizację';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NAME = 'Nazwa';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NET = 'Kwota netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_GROSS = 'Kwota brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_VALUE = 'Wartość %';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_NAME = 'Nazwa';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_CREATE = 'Nowy wniosek o udzielenie zamówienia publicznego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_EDIT = 'Edycja wniosku o udzielenie zamówienia publicznego: ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_NUMBER = 'Numer wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE = 'Tryb wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CREATE_DATE = 'Data utworzenia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE = 'Data przekazania do ZP';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS = 'Status';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUPS = 'Grupy asortymentowe';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDERING_MODE = 'Tryb udzielenia zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT = 'Vat';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_PLANNED = 'Planowany';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS = 'Podział zamówienia na części';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REASON_LACK_PARTS = 'Zamówienie nie zostało podzielone na części, ponieważ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CPV = 'CPV (Wspólny Słownik Zamówień)';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_UNPLANNED = 'Nie ujęty w planie';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REASON_NOT_INCLUDED = 'Powód nie ujęcia w planie';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMBINED = 'Czy wniosek łączony?';
export const COORDINATOR_PLAN_POSITION_PUBLIC_COORDINATOR_COMBINED = 'Koordynator z którym wniosek będzie łączony';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_NET = 'Wartość zamówienia netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_GROSS = 'Wartość zamówienia brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_NET = 'Do wydania w roku bieżącym netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_GROSS = 'Do wydania w roku bieżącym brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_VALUE = 'Wartość grupy netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_APPLICATION_VALUE = 'Wartość zamówienia w ramach grupy netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_BASED = 'Podstawa określenia wartości zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_SETTING_VALUE_PERSON = 'Osoba ustalająca wartość';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DATE_ESTABLISHED_VALUE = 'Ustalenie wartości';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_JUSTIFICATION_PURCHASE = 'Uzasadnienie zakupu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DESCRIPTION = 'Opis przedmiotu zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_DESCRIPTION = 'Osoby przygotowujące opis przedmiotu zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REQUIREMENTS_VARIANT_BIDS = 'Wymogi dotyczące ewentualnych ofert wariantowych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PROPOSED_ORDERING_PROCEDURE = 'Proponowany tryb udzielenia zamówienia (w przypadku proponowania trybu innego niż przetarg nieograniczony'
                                                                                       + ' lub ograniczony wskazać uzasadnienie formalne)';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_JUSTIFICATION = 'Osoby przygotowujące uzasadnienie faktyczne i prawne wyboru trybu udzielenia zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REALIZATION_TERM = 'Termin realizacji zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_NAME = 'Nazwa wykonawcy, z którym będą przeprowadzone negocjacje';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_CHOOSING_CONTRACTOR = 'Osoby dokonujące wyboru wykonawcy zaproszonego do negocjacji/dokonujące wyboru wykonawców zaproszonych do składania ofert';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_CONDITIONS = 'Warunki, które musi spełnić wykonawca';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CONDITIONS = 'Osoby przygotowujące opis sposobu dokonywania oceny spełniania warunków udziału w postępowaniu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_IMPORTANT_RECORDS = 'Istotne zapisy związane z przedmiotem zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERIA_EVALUATION_OFFERS = 'Kryteria oceny ofert';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CRITERIA = 'Osoby określające kryteria oceny ofert';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TENDER_COMMITTEE = 'Osoby proponowane do składu Komisji Przetargowej/przeprowadzenia negocjacji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WARRANTY_REQUIREMENTS = 'Wymagania dotyczące gwarancji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMMENTS = 'Uwagi';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_SEND_MESSAGE = 'Wniosek zostanie przkazany do Działu Zamówień Publicznych. Czy kontynuować?';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENTS_GROUPS_NET_EXCEEDED = 'Wartość zamówienia większa niż wartość grup asortymentowych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_NET_EXCEEDED = 'Wartość w roku bieżącym większa niż wartość zamówienia';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP = 'Grupa asortymentowa wniosku o udzielenie zamówienia publicznego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_GROUP_INFO = 'Dane grupy w ramach planu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_INFO = 'Dane grupy w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_NET = 'Wartość grupy w ramach planu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_INFERRED_VALUE_NET = 'Wartość złożonych wniosków w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_VALUE_NET = 'Realizacja grupy w ramach planu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET = 'Wartość zamówienia w ramach grupy netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS = 'Wartość zamówienia w ramach grupy brutto';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_EXISTS = 'Wybrana grupa asotymentowa istnieje w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_YEAR_REQUESTED_INVALID = 'Kwota do wydania w roku większa od wartości zamówienia w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_REQUESTED_INVALID = 'Kwota do wydania w roku większa od wartości grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_INVALID = 'Kwota do wydania w roku większa od możliwej wartości realizacji grupy';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationPartForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_CREATE = 'Nowa część zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_EDIT = 'Edycja części zamówienia numer: ';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationPartFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_INVALID_VALUE_NET = 'Kwota większa niż wartość zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_INVALID_COUNT_VALUE_NET = 'Wartość części większa niż wartość zamówienia';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationCriterionForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_TITLE_CREATE = 'Nowe kryterium';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_TITLE_EDIT = 'Edycja kryterium: ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_SCORING_DESCRIPTION = 'Opis punktacji';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationCriterionFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_VALUE = 'Maksymalna wartość 100%';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERION_INVALID_COUNT_VALUE = 'Wartość kryteriów ponad 100%';
/* components/modules/coordinator/registers/publicProcurement/publicProcurement.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TITLE = 'Rejestr zamówień publicznych';
export const COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TABLE_HEAD_ROW_START_DATE = 'Data wszczęcia';
export const COORDINATOR_PUBLIC_PROCUREMENT_REGISTER_TABLE_HEAD_ROW_END_DATE = 'Data zakończenia';
/* components/modules/coordinator/registers/publicProcurement/forms/publicProcurementPosition.js */
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_TITLE_CREATE = 'Rejestr Zamówień Publicznych - Nowa pozycja';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_TITLE_EDIT = 'Rejestru Zamówień Publicznych - Edycja pozycji: ';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_NUMBER = 'Numer postępowania';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_CHANGE_MODE = 'Zmiana trybu udzielenia';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_NEW_MODE = 'Nowy tryb udzielenia';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_CHANGE_MODE_REASON = 'Powód zmiany trybu';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_ASSORTMENT_GROUP_VALUE = 'Wartość grupy asortymentowej netto';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_SEND_DATE = 'Data przekazania do ZP';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_TIME_LIMIT = 'Termin realizacji';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_EXECUTION_DATE = 'Data realizacji';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_VALUE_NET = 'Wartość realizacji netto';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_VALUE_GROSS = 'Wartość realizacji brutto';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_INFO = 'Rozstrzygnięcie';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_INFO = 'Wykonawca';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR = 'Nazwa';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_CITY = 'Miasto';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_ZIP_CODE = 'Kod pocztowy';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_STREET = 'Ulica';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_CONTRACTOR_BUILDING = 'Numer budynku';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_REALIZATION_DOCUMENT = 'Rodzaj dokumentu realizacji';
export const COORDINATOR_REGISTER_PUBLIC_PROCUREMENT_POSITIONS_DOCUMENT_REALIZATION_NUMBER = 'Numer dokumentu realizacji';
/* components/modules/coordinator/plans/forms/planPublicProcurementContentPosition */
export const COORDINATOR_PLAN_POSITION_PUBLIC_INDICATIVE_ORDER_VALUE_GROSS = 'Orientacyjna kwota brutto';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_PROCEDURE_MODE = 'Tryb lub procedura udzielenia';
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE = 'Typ wartości szacukowej';
export const COORDINATOR_PLAN_POSITION_PUBLIC_EURO_EXCHANGE_RATE = 'Kurs Euro';
export const COORDINATOR_PLAN_POSITION_PUBLIC_EURO_VALUE_NET = 'Wartość Euro netto';
/* components/modules/accountant/accountant.js */
export const ACCOUNTANT = "Księgowy";
export const ACCOUNTANT_MENU_COORDINATOR = 'Koordynator';
export const ACCOUNTANT_MENU_INSTITUTION = 'Instytucja';
export const ACCOUNTANT_MENU_DICTIONARIES = 'Słowniki';
export const ACCOUNTANT_SUBMENU_INSTITUTION_PLANS = 'Plany';
export const ACCOUNTANT_SUBMENU_COORDINATOR_PLANS = 'Plany';
export const ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES = 'Rodzaje kosztów';
/* components/modules/accountant/coordinator/plans/plans.js */
export const ACCOUNTANT_COORDINATOR_PLANS_TITLE = 'Plany Koordynatorów';
export const ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR = 'Koordynator';
export const ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS = 'Kwota szacowana brutto';
export const ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REALIZED_GROSS = 'Kwota zrealizowana brutto';
export const ACCOUNTANT_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_AWARDED_GROSS = 'Kwota przyznana brutto';
export const ACCOUNTANT_COORDINATOR_PLANS_CONFIRM_WITHDRAW_MESSAGE = 'Zatwierdzenie planu zostanie wycofane. Czy kontynuować?'
/* components/modules/accountant/coordinator/plans/forms/planBasicInfoForm.js */
export const ACCOUNTANT_COORDINATOR_PLAN_PLAN_TITLE = 'Plan ';
export const ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_APPROVE_MESSAGE = 'Plan zostanie zatwierdzony. Czy kontynuować?';
export const ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_FORWARD_MESSAGE = 'Plan zostanie przekazany do koordynatora. Czy kontynuować?';
export const ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_ACCEPT_POSITIONS_MESSAGE = 'Dla wszystkich zaznaczonych pozycji zostanie przyznana kwota szacowana. Czy kontynuować?';
export const ACCOUNTANT_PLAN_COORDINATOR_ACCOUNTANT_ACCEPT_USER = 'Akceptacja Głównego Księgowego';
export const ACCOUNTANT_PLAN_COORDINATOR_DIRECTOR_ACCEPT_USER = 'Zatwierdzenie Dyrektor Pionu';
export const ACCOUNTANT_PLAN_COORDINATOR_ECONOMIC_ACCEPT_USER = 'Zatwierdzenie Dyrektor Ekonomiczny';
export const ACCOUNTANT_PLAN_COORDINATOR_CHIEF_ACCEPT_USER = 'Zatwierdzenie Dyrektor Naczelny';
/* components/modules/accountant/coordinator/plans/forms/planCorrectionPositionForm.js */
export const ACCOUNTANT_PLAN_COORDINATOR_CORRECTION_POSITIONS_TITLE = 'Korekta pozycji: ';
export const ACCOUNTANT_PLAN_COORDINATOR_POSITION_REMARKS_TITLE = 'Uwagi dla pozycji: ';
export const ACCOUNTANT_PLAN_INSTITUTION_CORRECTION_POSITIONS_TITLE = 'Korekta pozycji w planie Koordynatora: ';
/* components/modules/accountant/coordinator/plans/forms/planInvestmentPositionFoundingSourcesForm */
export const ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_NET = 'Przyznana kwota zadania netto';
export const ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_AWARDED_GROSS = 'Przyznana kwota zadania brutto';
export const ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_NET = 'Przyznana kwota wydatku netto';
export const ACCOUNTANT_PLAN_INVESTMENTS_POSITION_SOURCE_EXPENSES_PLAN_AWARDED_GROSS = 'Przyznana kwota wydatku brutto';
/* components/modules/accountant/institution/plans/plans.js */
export const ACCOUNTANT_INSTITUTION_PLANS_TITLE = 'Plany';
/* components/modules/accountant/institution/plans/plan.js */
export const ACCOUNTANT_INSTITUTION_POSITION_SEARCH_COST_TYPE = 'Rodzaj kosztu / Nazwa rodzaju kosztu';
/* components/modules/accountant/institution/plans/forms/planPositionsForm.js */
export const ACCOUNTANT_INSTITUTION_PLAN_POSITIONS_TITLE = 'Pozycja planu: ';
export const ACCOUNTANT_INSTITUTION_PLAN_COORDINATOR_POSITIONS = 'Pozycje w planach Koordynatorów: ';
export const ACCOUNTANT_INSTITUTION_PLAN_COORDINATOR_POSITIONS_BUTTON_PLAN = "Plan";
/* components/modules/accountant/coordinator/plans/forms/planUpdateForm.js */
export const ACCOUNTANT_PLAN_COORDINATOR_CONFIRM_CORRECTION_APPROVE_MESSAGE = 'Korekta planu zostanie zatwierdzona. Czy kontynować?'
/* components/modules/accountant/dictionary/costsTypes.js */
export const ACCOUNTANT_COSTS_TYPES_TABLE_HEAD_ROW_NUMBER = 'Numer';
export const ACCOUNTANT_COSTS_TYPES_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const ACCOUNTANT_COSTS_TYPES_CONFIRM_DELETE_MESSAGE = 'Rodzaj kosztu zostanie usunięty. Czy kontynuować?';
export const ACCOUNTANT_COSTS_TYPES_SEARCH_NUMBER_NAME = 'Numer / Nazwa';
/* components/modules/accountant/dictionary/costType.js */
export const ACCOUNTANT_CREATE_COST_TYPE_TITLE = 'Nowy rodzaj kosztu';
export const ACCOUNTANT_EDIT_COST_TYPE_TITLE = 'Edycja rodzaju kosztu:';
/*components/modules/accountant/dictionary/forms/costTypeForm.js*/
export const ACCOUNTANT_COST_TYPE_BASIC_INFORMATION = 'Dane podstawowe';
export const ACCOUNTANT_COST_TYPE_NUMBER = 'Numer';
export const ACCOUNTANT_COST_TYPE_NAME = 'Nazwa';
export const ACCOUNTANT_COST_TYPE_ACTIVE = 'Aktywny';
export const ACCOUNTANT_COST_TYPE_YEARS_VALIDITY = 'Okresy obowiązywania:';
export const ACCOUNTANT_COST_TYPE_YEARS_VALIDITY_YEAR = 'Rok';
export const ACCOUNTANT_CONFIRM_DELETE_YEAR_MESSAGE = 'Okres obowiązywania dla Rodzaju Kosztu zostanie usunięty. Czy kontynuować?';
/*components/modules/accountant/dictionary/forms/costTypeFormValid.js*/
export const ACCOUNTANT_COST_TYPE_CODE_EXISTS = 'Podany numer już istnieje';
/*components/modules/accountant/dictionary/forms/costYearForm.js*/
export const ACCOUNTANT_COST_TYPE_YEAR_DETAILS_TITLE = 'Rok obowiązywania - szczegoły';
export const ACCOUNTANT_COST_TYPE_YEAR = 'Rok obowiązywania';
export const ACCOUNTANT_COST_TYPE_ALL_COORDINATORS = 'Koordynatorzy: ';
export const ACCOUNTANT_COST_TYPE_YEAR_COORDINATORS = 'Przypisani koordynatorzy: ';
/*components/modules/accountant/dictionary/forms/costYearFormValid.js*/
export const ACCOUNTANT_COST_TYPE_YEAR_EXISTS = 'Podany okres obowiązywania istnieje';
/* components/modules/director/coordinator/plans/plans.js */
export const DIRECTOR_COORDINATOR_PLAN_TABLE_HEAD_ROW_AMOUNT_REQUESTED_NET = 'Kwota szacowana netto';
/* components/modules/director/director.js */
export const DIRECTOR_MENU_PLANS = 'Plany';
export const DIRECTOR_MENU_COORDINATOR_PLANS = 'Koordynatorzy';
/* components/modules/director/coordinator/plans/planBasicInfoForm.js */
export const DIRECTOR_COORDINATOR_PLAN_TITLE = 'Szczegóły planu: ';
export const DIRECTOR_PLAN_COORDINATOR_CONFIRM_RETURN_MESSAGE = 'Plan zostanie wycofany do Koordynatora. Czy kontynuować?';
/* components/modules/publicProcurement/publicProcurement.js */
export const PUBLIC_MENU_COORDINATOR = 'Koordynator';
export const PUBLIC_SUBMENU_COORDINATOR_PLANS = 'Plany';
export const PUBLIC_SUBMENU_COORDINATOR_APPLICATIONS = 'Wnioski';
export const PUBLIC_MENU_INSTITUTION = 'Instytucja';
export const PUBLIC_SUBMENU_INSTITUTION_PLANS = 'Plany';
export const PUBLIC_MENU_DICTIONARIES = 'Słowniki';
export const PUBLIC_SUBMENU_DICTIONARIES = 'Słowniki';
/* components/modules/publicProcurement/coordinators/plans/plans.js */
export const PUBLIC_COORDINATOR_PLANS_TITLE = 'Plany Koordynatorów';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR = 'Rok';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_COORDINATOR = 'Koordynator';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS = 'Kwota szacowana netto';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_AMOUNT_REALIZED_GROSS = 'Kwota zrealizowana netto';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_STATUS = 'Status';
/* components/modules/publicProcurement/coordinator/plans/forms/planBasicInfoForm.js */
export const PUBLIC_PLAN_COORDINATOR_ACCEPT_USER = 'Akceptacja Zamówień Publicznych';
/* components/modules/publicProcurement/institution/plans/plans.js */
export const PUBLIC_INSTITUTION_PLANS_TITLE = 'Plany';
/* components/modules/publicProcurement/institution/plans/plan.js */
export const PUBLIC_INSTITUTION_PLAN_TITLE = 'Plan Zamówień Publicznych';
/*components/modules/hr/humanResources.js*/
export const HR_MENU_STAFF = 'Personel';
export const HR_MENU_STAFF_WORKERS = 'Pracownicy';
/*components/modules/hr/staff/workers.js*/
export const WORKERS_TABLE_HEAD_ROW_ID = 'Id';
export const WORKERS_TABLE_HEAD_ROW_NAME = 'Imię';
export const WORKERS_TABLE_HEAD_ROW_SURNAME = 'Nazwisko';
export const WORKERS_SEARCH_NAME = 'Imię';
export const WORKERS_SEARCH_SURNAME = 'Nazwisko';
/*components/modules/hr/staff/worker.js*/
export const WORKER_CREATE_NEW_WORKER_TITLE = 'Nowy pracownik';
export const WORKER_EDIT_WORKER_TITLE = 'Edycja pracownika: ';
export const WORKER_BASIC_INFORMATION = 'Dane podstawowe';
export const WORKER_EMPLOYMENTS = 'Zatrudnienie';
export const WORKER_FUNCTION = 'Funkcje';
/*components/modules/hr/staff/forms/workerBasicInfoForm.js*/
export const WORKER_BASIC_INFORMATION_ID = 'Id';
export const WORKER_BASIC_INFORMATION_NAME = 'Imię';
export const WORKER_BASIC_INFORMATION_SURNAME = 'Nazwisko';
export const WORKER_BASIC_INFORMATION_OU = 'Jednostka organizacyjna';
/*components/modules/hr/staff/forms/workerEmploymentsForm.js*/
export const WORKER_EMPLOYMENTS_PERIODS = 'Okresy zatrudnienia:';
export const WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_POSITION = 'Stanowisko';
export const WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_OU = 'Jednostka';
export const WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_DATE_FROM = 'Okres od';
export const WORKER_EMPLOYMENTS_TABLE_HEAD_ROW_DATE_TO = 'Okres do';
/*components/modules/hr/staff/forms/workerFunctionsForm.js*/
export const WORKER_FUNCTIONS = 'Pełnione funkcje:';
export const WORKER_FUNCTIONS_TABLE_HEAD_ROW_COMMISSION = 'Funkcja';
export const WORKER_FUNCTIONS_TABLE_HEAD_ROW_FUNCTION = 'Rola';
export const WORKER_FUNCTIONS_TABLE_HEAD_ROW_DATE_FROM = 'Data od';
export const WORKER_FUNCTIONS_TABLE_HEAD_ROW_DATE_TO = 'Data do';
/*components/modules/hr/staff/forms/employmentForm.js*/
export const WORKER_EMPLOYMENT_DETAILS_TITLE = 'Zatrudnienie - szczegóły pozycji';
export const WORKER_EMPLOYMENT_DETAILS_NUMBER = 'Numer';
export const WORKER_EMPLOYMENT_DETAILS_FORM = 'Forma zatrudnienia';
export const WORKER_EMPLOYMENT_DETAILS_OU = 'Jednostka organizacyjna';
/*components/modules/hr/staff/forms/functionForm.js*/
export const WORKER_FUNCTION_DETAILS_TITLE = 'Funkcja - szczegóły pozycji';
export const WORKER_FUNCTION_DETAILS_NUMBER = 'Numer';
export const WORKER_FUNCTION_DETAILS_COMMENTS = 'Uwagi';
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
export const BUTTON_SELECT = 'Wybierz';
export const BUTTON_WITHDRAW = 'Wycofaj';
export const BUTTON_SEND = 'Wyślij';
export const BUTTON_RECEIVE = 'Przyjmij';
export const BUTTON_CORRECT = 'Koryguj';
export const BUTTON_ACCEPT = 'Akceptuj';
export const BUTTON_APPROVE = 'Zatwierdź';
export const BUTTON_COORDINATOR = 'Przekazanie - Koordynator';
export const BUTTON_RETURN_COORDINATOR = 'Wycofanie - Koordynator';
export const BUTTON_APPROVE_DIRECTOR = 'Zatwierdzenie - Dyrektor pionu';
export const BUTTON_APPROVE_ECONOMIC = 'Zatwierdzenie - Dyrektor ekonomiczny';
export const BUTTON_APPROVE_CHIEF = 'Zatwierdzenie - Dyrektor naczelny';
export const BUTTON_CONSIDER = 'Rozpatrz';
export const BUTTON_PRINT = 'Drukuj';
export const BUTTON_PRINT_BASIC = 'Wydruk podstawowy';
export const BUTTON_PRINT_DETAILS = 'Wydruk szczegółowy';
export const BUTTON_UPDATE = 'Aktualizuj';
export const BUTTON_REMARKS = 'Uwagi';
export const BUTTON_DETAILS = 'Szczegoły';
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
export const MODAL_DIALOG_FORM_CHANGE_MSG = 'Dane zostały zmodyfikowane. Niezapisane dane zostaną utracone. Czy kontynuować?'
/*common/gui/guiDatePicker.js*/
export const DATE_PICKER_INVALID_DATE_MESSAGE = 'Nieprawidłowy format daty';
export const DATE_PICKER_MAX_DATE_MESSAGE = 'Data późniejsza niż data maksymalna';
export const DATE_PICKER_MIN_DATE_MESSAGE = 'Data wcześniejsza niż data minimalna';
export const DATE_PICKER_MONTHS_JANUARY = 'Styczeń';
export const DATE_PICKER_MONTHS_FEBRUARY = 'Luty';
export const DATE_PICKER_MONTHS_MARCH= 'Marzec';
export const DATE_PICKER_MONTHS_APRIL= 'Kwiecień';
export const DATE_PICKER_MONTHS_MAI= 'Maj';
export const DATE_PICKER_MONTHS_JUNE= 'Czerwiec';
export const DATE_PICKER_MONTHS_JULY= 'Lipiec';
export const DATE_PICKER_MONTHS_AUGUST= 'Sierpień';
export const DATE_PICKER_MONTHS_SEPTEMBER= 'Wrzesień';
export const DATE_PICKER_MONTHS_OCTOBER= 'Październik';
export const DATE_PICKER_MONTHS_NOVEMBER= 'Listopad';
export const DATE_PICKER_MONTHS_DECEMBER= 'Grudzień';
/* common/form/fromAmountField */
export const FORM_AMOUNT_FIELD_DEFAULT_SUFFIX = 'zł.';
/* Form */
export const VAT = 'Vat';
/* Form error names */
export const FORM_ERROR_MSG_REQUIRED_FIELD = 'Pole wymagane';
export const FORM_ERROR_MSG_INVALID_EMAIL_ADDRESS = 'Nieprawidłowy adres email';
export const FORM_ERROR_MSG_INVALID_NIP = 'Nieprawidłowy numer NIP';
export const FORM_ERROR_MSG_INVALID_REGON= 'Nieprawidłowy numer REGON';
export const FORM_ERROR_MSG_INVALID_CHAR = 'Pole zawiera niedozwolone znaki';
export const FORM_ERROR_MSG_INVALID_ZIP_CODE = 'Nieprawidłowy kod pocztowy';
export const FORM_ERROR_MSG_INVALID_PHONE_NUMBER = 'Nieprawidłowy numer telefonu';
export const FORM_ERROR_MSG_INVALID_FAX_NUMBER = 'Nieprawidłowy numer fax';
export const FORM_ERROR_MSG_INVALID_DATE = 'Nieprawidłowa data';
export const FORM_ERROR_MSG_INVALID_VALUE = 'Nieprawidłowa wartość';