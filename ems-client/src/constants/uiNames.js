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
export const ORGANIZATION_UNIT_COORDINATOR_SYMBOL = 'Symbol kancelaryjny';
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
export const DICTIONARY_ITEM_NAME_EXISTS = 'Pozycja o podanej nazwie istnieje';
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
export const COORDINATOR_MENU_REALIZATION = 'Realizacja';
export const COORDINATOR_SUBMENU_REALIZATION_CONTRACTS = "Umowy";
export const COORDINATOR_SUBMENU_REALIZATION_EXPENSES= "Wydatki";
export const COORDINATOR_SUBMENU_REALIZATION_INVOICES= "Faktury";
export const COORDINATOR_SUBMENU_PUBLIC_APPLICATION = 'Wnioski ZP';
export const COORDINATOR_SUBMENU_PUBLIC_REGISTER = 'Rejestr';
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
export const COORDINATOR_PLANS_CONFIRM_SEND_BACK_MESSAGE = 'Plan zostanie wycofany do Koordynatora. Czy kontynuować?';
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
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_CONSTRUCTION_WORKS = 'Roboty budowlane';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_DO50 = 'Do 50 000 zł netto';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_D0130 = 'Wyższy niż 50 000 zł netto i niższy niż 130 000 zł netto';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_PO130 = 'Równy lub przekraczający 130 000 zł netto BZP';
export const COORDINATOR_PLAN_POSITION_ORDER_TYPE_UE139 = 'Równy lub przekraczający progi unijne';
/* components/modules/coordinator/plans/plan.js */
export const COORDINATOR_PLAN_CREATE_NEW_PLAN_TITLE = 'Nowy plan';
export const COORDINATOR_PLAN_EDIT_PLAN_TITLE = 'Edycja planu: ';
export const COORDINATOR_PLAN_UPDATE_PLAN_TITLE = 'Aktualizacja planu nr ';
export const COORDINATOR_PLAN_BASIC_INFORMATION = 'Dane podstawowe';
export const COORDINATOR_PLAN_POSITIONS = 'Pozycje planu';
export const COORDINATOR_PLAN_PUBLIC_ORDERS_REGISTER = 'Rejestr zamówień publicznych';
/* components/modules/coordinator/plans/planPositionRealization.js */
export const COORDINATOR_PLAN_POSITION_REALIZATION_TITLE = 'Realizacja pozycji: ';
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
export const COORDINATOR_PLAN_POSITION_AMOUNT_INFERRED_NET = 'Kwota złożonych wniosków netto';
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
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_MODE = 'Próg';
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
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECT = "Korekta - kwota szacowana";
export const COORDINATOR_PLAN_UPDATE_FINANCIAL_POSITION_AMOUNT_CORRECT_NET = "Kwota szacowana netto po korekcie";
export const COORDINATOR_PLAN_UPDATE_FINANCIAL_POSITION_AMOUNT_CORRECT = "Kwota szacowana brutto po korekcie";
export const COORDINATOR_PLAN_UPDATE_FINANCIAL_POSITION_AMOUNT_AWARDED_CORRECT = "Korekta - kwota przyznana";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_TASK_CORRECTED = "Korekta zadania";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_EXPENSES_CORRECTED = "Kwota przyznana - Korekta";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_CORRECTED = "Kwota po korekcie";
export const COORDINATOR_PLAN_UPDATE_PUBLIC_POSITION_VALUE = 'Kwota przed korektą';
export const COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_TASK = 'Kwota zadania przed korektą';
export const COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_EXPENSES = 'Przyznana kwota przed korektą';
export const COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_TASK_CORRECTED = 'Kwota zadania po korekcie';
export const COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_CORRECTED = 'Kwota wydatku po korekcie';
export const COORDINATOR_PLAN_UPDATE_POSITION_INVESTMENT_AMOUNT_EXPENSES_CORRECTED = 'Przyznana kwota wydatku po korekcie';
/* components/modules/coordinator/plans/planUpdateFinancialContentPositionForm.js */
export const COORDINATOR_PLAN_UPDATE_POSITION_DETAILS_TITLE = "Szczegóły pozycji planu: ";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_BEFORE_CORRECTED_NET = "Kwota przyznana netto przed korektą";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_BEFORE_CORRECTED_GROSS = "Kwota przyznana brutto przed korektą";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AFTER_CORRECTED_NET = "Kwota netto po korekcie";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AFTER_CORRECTED_GROSS = "Kwota brutto po korekcie";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_REQUESTED_AFTER_CORRECTED_GROSS = "Kwota szacowana brutto po korekcie";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AWARDED_AFTER_CORRECTED_NET = "Kwota przyznana netto po korekcie";
export const COORDINATOR_PLAN_UPDATE_POSITION_AMOUNT_AWARDED_AFTER_CORRECTED_GROSS = "Kwota przyznana brutto po korekcie";
/* components/modules/coordinator/plans/planUpdateFinancialContentPositionFormValid.js */
export const COORDINATOR_PLAN_UPDATE_PLAN_AMOUNT_AWARDED_EXCEEDED = "Przekroczono zatwierdzoną wartość planu";
/* containers/modules/coordinator/publicProcurement/applications/applicationsContainer.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_SAVE = 'Zapisany';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_SEND = 'Wysłany';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_PUBLIC_PROCUREMENT = 'Akceptacja ZP';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_DIRECTOR = 'Akceptacja - Dyrektor pionu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_MEDICAL = 'Akceptacja - Dyrektor medyczny';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_ACCOUNTANT = 'Akceptacja - Główny księgowy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED_CHIEF = 'Akceptacja - Dyrektor naczelny';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_APPROVED = 'Zatwierdzony';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_REALIZED = 'Realizowany';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_EXECUTED = 'Zakończony';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS_CANCELLED = 'Anulowany';
/* components/modules/coordinator/publicProcurement/applications/applications.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_TITLE = 'Wnioski o udzielenie zamówień publicznych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_ORDER_VALUE_NET = 'Wartość wniosku netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_NUMBER = 'Numer wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_DELETE_MSG = 'Wniosek zostanie usunięty. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_WITHDRAW_MSG = 'Wniosek zostanie wycofany. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATIONS_CONFIRM_WITHDRAW_REALISATION_MSG = 'Realizacja wniosku zostanie anulowana. Modyfikacja wniosku będzie niemożliwa. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WITHDRAW = 'Wycofaj';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WITHDRAW_REALISATION = 'Wycofaj realizację';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE_FROM = 'Data przekazania ZP od';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE_TO = 'Data przekazania ZP do';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NAME = 'Nazwa';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_NET = 'Kwota netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_PART_GROSS = 'Kwota brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_VALUE = 'Wartość %';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_HEAD_TABLE_CRITERIA_NAME = 'Nazwa';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_CREATE = 'Nowy wniosek o udzielenie zamówienia publicznego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TITLE_EDIT = 'Edycja wniosku o udzielenie zamówienia publicznego: ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_NUMBER = 'Numer wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MEDICAL_DIRECTOR_ACCEPT_USER = 'Zatwierdzenie Dyrektor Medyczny';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE = 'Tryb wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CREATE_DATE = 'Data utworzenia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SEND_DATE = 'Data przekazania do ZP';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_STATUS = 'Status';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_IS_REPLAY = 'Czy obecny wniosek jest powtórką?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_IS_PUBLIC_REALIZATION = 'Czy wniosek realizowany przez ZP?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SOURCE_APPLICATION = 'Numer wniosku źródłowego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ACCEPT_PATH = 'Akceptacja wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUPS = 'Grupy asortymentowe';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_THRESHOLD = 'Próg';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VAT = 'Vat';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_PLANNED = 'Planowany';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS = 'Podział zamówienia na części';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REASON_LACK_PARTS = 'Zamówienie nie zostało podzielone na części, ponieważ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CPV = 'CPV (Wspólny Słownik Zamówień)';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_PROCEDURE = 'Tryb udzielenia zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MODE_UNPLANNED = 'Nie ujęty w planie';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REASON_NOT_INCLUDED = 'Powód nie ujęcia w planie';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMBINED = 'Czy wniosek łączony?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE = 'Zamówienie ujęte w:';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE_FINANCIAL = 'planie finansowym';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COORDINATOR_TYPE_INVESTMENT = 'planie inwestycyjnym';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ART_30 = 'Zastosowanie art. 30 ust. 4 ustawy PZP?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COORDINATOR_COMBINED = 'Koordynator z którym wniosek będzie łączony';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_NET = 'Wartość zamówienia netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_GROSS = 'Wartość zamówienia brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_NET = 'Do wydania w roku bieżącym netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_YEAR_GROSS = 'Do wydania w roku bieżącym brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_VALUE = 'Wartość grupy netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_APPLICATION_VALUE = 'Wartość zamówienia w ramach grupy netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_BASED = 'Podstawa określenia wartości szacunkowej zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_SETTING_VALUE_PERSON = 'Z należytą starannością wartość szacunkową zamówienia ustalił/a';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DATE_ESTABLISHED_VALUE = 'Data ustalenia wartości szacunkowej';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_JUSTIFICATION_PURCHASE = 'Uzasadnienie zakupu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_DESCRIPTION = 'Opis przedmiotu zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_DESCRIPTION = 'Osoby przygotowujące opis przedmiotu zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_REQUIREMENTS_VARIANT_BIDS = 'Wymogi dotyczące ewentualnych ofert wariantowych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PROPOSED_ORDERING_PROCEDURE = 'W przypadku proponowania trybu innego niż przetarg nieograniczony (UE) lub ograniczony (UE), tryb podstawowy (BZP) - wskazać uzasadnienie';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_JUSTIFICATION = 'Osoba przygotowująca uzasadnienie wyboru trybu udzielenia zamówienia innego niż przetarg nieograniczony (UE) lub ograniczony (UE), tryb podstawowy (BZP)';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_REALIZATION_TERM = 'Termin realizacji zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_NAME = 'Nazwa wykonawcy, z którym będą przeprowadzone negocjacje';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_JUSTIFICATION_NON_COMPETITIVE_PROCEDURE = 'Uzasadnienie niekonkurencyjnej procedury';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_CHOOSING_CONTRACTOR = 'Osoba dokonująca wyboru wykonawcy zaproszonego do negocjacji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_CONTRACTOR_CONDITIONS = 'Warunki, które musi spełnić wykonawca, aby móc uczestniczyć w postępowaniu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CONDITIONS = 'Osoba przygotowująca opis warunków udziałów w postępowaniu w tym sposobu dokonania ich oceny oraz określająca przedmiotowe środki dowodowe';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONDITIONS_PARTICIPATION = 'Warunki udziału w postępowaniu / przedmiotowe środki dowodowe';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_IMPORTANT_RECORDS_UP_TO_130 = 'Istotne zapisy związane z przedmiotem zamówienia konieczne, do umieszczenia w zaproszeniu do składania ofert lub/i projekcie umowy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_IMPORTANT_RECORDS_UE = 'Istotne zapisy związane z przedmiotem zamówienia konieczne, do umieszczenia w SWZ lub/i projekcie umowy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CRITERIA_EVALUATION_OFFERS = 'Kryteria oceny ofert';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERSONS_PREPARING_CRITERIA = 'Osoby określające kryteria oceny ofert';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_TENDER_COMMITTEE = 'Osoby proponowane do składu Komisji Przetargowej/przeprowadzenia negocjacji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MARKET_CONSULTATION = 'Informacja o przeprowadzeniu Wstępnych Konsultacji Rynkowych zgodnie z art. 84 ustawy PZP';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_FINANCED = 'Informacja czy przedmiot zamówienia jest finansowany z MZ, UE itp.';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_PARTICIPATED_PREPARATION = 'Informacja czy istnieje możliwość, że o udzielenie zamówenia będzie ubiegał się podmiot, który uczestniczył w przygotowaniu postępowania';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_MEASURES_AVOIDANCE_DISTORTIONS = 'Wskazać środki mające na celu zapobieżenie zakłócenia uczciwej konkurencji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SECURING_CONTRACT = 'Informacja na temat zabezpieczenia należytego wykonania umowy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_WARRANTY_REQUIREMENTS = 'Wymagania dotyczące gwarancji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PROTOCOL = 'Protokół';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONTRACTOR_CONTRACT = 'Po wykonaniu czynności określonych w Regulaminie udzielania zamówień publicznych proponuję udzielić zamówienia Wykonawcy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT = 'Opis wykonanych czynności - forma rozeznania cenowego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_EMAIL = 'mailowa';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_PHONE = 'telefoniczna';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_INTERNET = 'cenniki internetowe';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_PAPER = 'oferty papierowe';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_OTHER = 'inna';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_OTHER_DESC = 'tj.';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_DISCERNMENT_RENOUNCEMENT = 'odstąpienie od rozeznania';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICE_NON_COMPETITIVE= 'uzasanienie niekonkurencyjnej procedury';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS_VALUE_NET= 'Suma części netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PARTS_VALUE_GROSS= 'Suma części brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE = 'Cena wybranej oferty';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_NET = 'Cena wybranej oferty netto w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_OFFER_PRICE_GROUP_GROSS = 'Cena wybranej oferty brutto w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PERFORMED_ACTIVITIES = 'Opis wykonanych czynności – forma rozeznania cenowego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_JUSTIFICATION_CHOOSING_OFFER = 'Uzasadnienie wyboru oferty/ustalenia z negocjacji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_COMMENTS = 'Uwagi';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_SEND_MSG = 'Wniosek zostanie przkazany do Działu Zamówień Publicznych. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_MSG = 'Wniosek zostanie zaakceptowany. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_DIRECTOR_MSG = 'Wniosek zostanie zaakceptowany na poziomie Dyrektora Pionu. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_MEDICAL_MSG = 'Wniosek zostanie zaakceptowany na poziomie Dyrektora Medycznego. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_APPROVE_ACCOUNTANT_MSG = 'Wniosek zostanie zaakceptowany na poziomie Głównego Księgowego. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_WITHDRAW_MSG = 'Wniosek zostanie anulowany. Kwota realizacji zostanie zwrócona do ponownego wykożystania. Operacja nie będzie możliwa do wycofania. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_SEND_BACK_MSG = 'Wniosek zostanie zwrócony do Koordynatora. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_REALIZATION_MSG = 'Realizacja wniosku zostanie zakończona. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CONFIRM_PUBLIC_REALIZATION_MSG = 'Wniosek zostanie oznaczony jako realizowany przez Pracownika Działu Zamówień Publicznych. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ROLLBACK_REALIZATION_MSG = 'Realizacja wniosku zostanie wycofana. Wniosek zostanie anulowany. Czy kontynuować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ROLLBACK_PARTS_REALIZATION_MSG = 'Realizacja części wniosku zostanie wycofana. Czy kontyniować?';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_PROTOCOL = 'Protokół';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_REALIZED = 'Zakończ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_ROLLBACK_REALIZATION = 'Anuluj wniosek';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_ROLLBACK_PART_REALIZATION = 'Wycofaj część realizacji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_BUTTON_PUBLIC_REALIZATION = 'Realizacja ZP';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PUBLIC_REALIZATION = 'ZP';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENTS_GROUPS_NET_EXCEEDED = 'Wartość zamówienia większa niż wartość grup asortymentowych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_VALUE_NET_EXCEEDED = 'Wartość w roku bieżącym większa niż wartość zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ARRAY_FIELD_REQUIRE = 'Wymagane wprowadzenie pozycji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_CHECKBOX_FIELD_REQUIRE = 'Wymagane wybranie opcji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENTS_GROUPS_PLAN_POSITION_REQUIRE = 'Nie uzupełniono informacji o pozycjach w ';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP = 'Grupa asortymentowa wniosku o udzielenie zamówienia publicznego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_GROUP_INFO = 'Dane grupy asortymentowej w ramach planu zamówień publicznych instytucji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PLAN_COR_GROUP_INFO = 'Dane grupy asortymentowej w ramach planu Koordynatora';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_INFO = 'Dane grupy asortymentowej w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_NET = 'Całkowita wartość netto grupy asortymentowej';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_COR_VALUE_NET = 'Wartość netto grupy asortymentowej';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_PLAN_TYPE_FIN = 'Pozycja w ramach planu finansowego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_FINANCIAL_PLAN_POSITION = 'Numer kosztu rodzajowego z planu finansowego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_NET = 'Wartość pozycji netto w roku bieżącym';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_POSITION_GROSS = 'Wartość pozycji brutto w roku bieżącym';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_PLAN_TYPE_INW = 'Pozycja w ramach planu inwestycyjnego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_INVESTMENT_PLAN_POSITION = 'Nazwa zadania inwestycyjnego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_INFERRED_VALUE_NET = 'Wartość złożonych wniosków w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_VALUE_NET = 'Realizacja grupy w ramach planu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET_50 = 'Wartość udzielanego zamówienia netto / cena wybranej oferty netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_NET_OTHER = 'Szacunkowa wartość udzielanego zamówienia netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS_50 = 'Wartość udzielanego zamówienia brutto / cena wybranej oferty brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_VALUE_GROSS_OTHER = 'Szacunkowa wartość udzielanego zamówienia brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ORDER_GROUP_NEXT_YEARS = 'Wydatki w latach kolejnych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_ART30 = 'Instytucja realizacja art. 30 ust. 4';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_NET_ART30 = 'Instytucja netto art. 30 ust. 4';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_REALIZED_GROSS_ART30 = 'Instytucja brutto art. 30 ust. 4';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_CONTRACT_AWARDED_NET = 'Wartość udzielonego zamówienia netto w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_GROUP_VALUE_CONTRACT_AWARDED_GROSS = 'Wartość udzielonego zamówienia brutto w ramach grupy';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationAssortmentGroupsFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_GROUP_EXISTS = 'Wybrana grupa asotymentowa istnieje w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_YEAR_REQUESTED_INVALID = 'Kwota do wydania w roku większa od wartości zamówienia w ramach grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_REQUESTED_INVALID = 'Kwota do wydania w roku większa od wartości grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_INVALID = 'Kwota do wydania w roku większa od możliwej wartości realizacji grupy';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_ASSORTMENT_ORDER_VALUE_GROUP_ART30_INVALID = 'Przekroczona wartość 20% dla art. 30 ust 4';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationPlanPositionForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_TITLE_CREATE = 'Nowa pozycja';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_TITLE_EDIT = 'Edycja pozycji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_INFO = 'Informacje w ramach planu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_POSITION_INFO = 'Informacje w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_AMOUNT_NET = 'Kwota netto pozycji w ramach planu';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_APPLICATION_PLAN_POSITION_AMOUNT_GROSS = 'Kwota brutto pozycji w ramach planu';
/* components/modules/coordinator/publicProcurement/applications/forms/subsequentYearsForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_TITLE_CREATE = 'Wydatek w latach kolenych';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_TITLE_EDIT = 'Edycja wydatku na rok: ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXPENDITURE_NET = 'Wartość wydatku netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXPENDITURE_GROSS = 'Wartość wydatku brutto';
/* components/modules/coordinator/publicProcurement/applications/forms/subsequentYearsFormValid.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_YEAR_EXISTS = 'Wydatek w danym roku już istnieje';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_EQUAL_YEAR = 'Rok wydatku musi być różny od bieżącego';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_PAST_YEAR = 'Rok wydatku nie może być z przeszłości';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_SUBSEQUENT_MAX_VALUE = 'Wartość w roku większa od wartości w ramach grupy';
/* components/modules/coordinator/publicProcurement/applications/forms/applicationPartForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_CREATE = 'Nowa część zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_TITLE_EDIT = 'Edycja części zamówienia: ';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION = 'Prawo opcji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_PERCENT_VALUE = 'Wartość % opcji';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_NET = 'Wartość opcji netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_OPTION_GROSS = 'Wartość opcji brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_SUM_NET = 'Suma netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_SUM_GROSS = 'Suma brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REALIZED_TITLE = 'Informacje o realizacji w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REALIZED = 'Realizacja części w ramach wniosku';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_REASON_NOT_REALIZED = 'Powód nie zrealizowania części';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_DESC_NOT_REALIZED = 'Opis';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_VALUE_CONTRACT_AWARDED_NET = 'Wartość udzielonego zamówienia netto w ramach części';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_VALUE_CONTRACT_AWARDED_GROSS = 'Wartość udzielonego zamówienia brutto w ramach części';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PART_CONFIRM_WITHDRAW_REALISATION_MSG = 'Realizacja części zostanie anulowana. Modyfikacja części będzie niemożliwa. Czy kontynuować?';
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
/* components/modules/coordinator/publicProcurement/applications/forms/protocolForm.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_TITLE = 'Protokół z udzielenia zamówienia';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_ACCEPT_PATH = 'Akceptacja protokołu';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_APPLICATION_NUMBER = 'Dot. wniosku numer';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_PROCEDURE_NUMBER = 'Numer postępowania';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_RECEIVED_OFFERS = 'Otrzymane oferty';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICES_VALUE_NET = 'Suma cen netto';
export const COORDINATOR_PUBLIC_PROCUREMENT_APPLICATION_PRICES_VALUE_GROSS = 'Suma cen brutto';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONTRACTOR_CONTRACT = 'Zgodnie z zapisami w Regulaminie udzielania zamówień publicznych proponuję udzielić zamówienia Wykonawcy';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_COMMENTS = 'Uwagi';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_COORDINATOR_MSG = "Protokół zostanie przekazany do Działu Zamówień Publicznych. Czy kontynuować?";
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_PUBLIC_MSG = "Protokół zostanie przekazany do Głównego Księgowego. Czy kontynuować?";
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_ACCOUNTANT_MSG = "Protokół zostanie przekazany do Dyrektora Naczelnego. Czy kontynuować?";
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_CHIEF_MSG = "Protokół zostanie zaakceptowany. Czy kontynuować?";
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_CONFIRM_SEND_BACK_MSG = "Protokół zostanie wycofany. Czy kontynuować?";
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
export const COORDINATOR_PLAN_POSITION_PUBLIC_ORDERING_ESTIMATION_TYPE = 'Próg';
export const COORDINATOR_PLAN_POSITION_PUBLIC_EURO_EXCHANGE_RATE = 'Kurs Euro';
export const COORDINATOR_PLAN_POSITION_PUBLIC_EURO_VALUE_NET = 'Wartość Euro netto';
/* components/modules/coordinator/realization/contracts/contracts.js */
export const COORDINATOR_REALIZATION_CONTRACTS_TITLE = 'Umowy';
export const COORDINATOR_REALIZATION_CONTRACTS_NUMBER = 'Numer umowy';
export const COORDINATOR_REALIZATION_CONTRACT_OBJECTS = 'Przedmiot umowy';
export const COORDINATOR_REALIZATION_CONTRACT_SIGNED_DATE = 'Data zawarcia';
export const COORDINATOR_REALIZATION_CONTRACT_SIGNED_FROM = 'Data zawarcia od';
export const COORDINATOR_REALIZATION_CONTRACT_SIGNED_TO = 'Data zawarcia do';
export const COORDINATOR_REALIZATION_CONTRACT_VALUE_GROSS = 'Wartość umowy brutto';
export const COORDINATOR_REALIZATION_CONTRACT_DELETE_MSG = 'Umowa oraz powiązane faktury zostaną usunięte. Czy kontynuować?';
/* components/modules/coordinator/realization/contracts/forms/contractForm.js */
export const COORDINATOR_REALIZATION_CONTRACT_TITLE_CREATE = 'Nowa umowa';
export const COORDINATOR_REALIZATION_CONTRACT_TITLE_EDIT = 'Edycja umowy nr: ';
export const COORDINATOR_REALIZATION_CONTRACT_NUMBER = 'Numer';
export const COORDINATOR_REALIZATION_CONTRACT_SIGNING_PLACE = 'Miejsce zawarcia';
export const COORDINATOR_REALIZATION_CONTRACT_PERIOD_FROM = 'Okres obowiązywania od';
export const COORDINATOR_REALIZATION_CONTRACT_PERIOD_TO = 'Okres obowiązywania do';
export const COORDINATOR_REALIZATION_CONTRACT_OBJECT = 'Przedmiot umowy';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_NET = 'Wartość umowy netto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_GROSS = 'Wartość umowy brutto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_PREV_YEARS_VALUE_NET = 'Realizacja w latach ubiegłych netto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_PREV_YEARS_VALUE_GROSS = 'Realizacja w latach ubiegłych brutto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_INVOICES_VALUE_NET = 'Realizacja umowy z faktur netto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_INVOICES_VALUE_GROSS = 'Realizacja umowy z faktur brutto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_VALUE_NET = 'Realizacja umowy netto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_REALIZED_VALUE_GROSS = 'Realizacja umowy brutto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_TO_REALIZE_NET = 'Pozostała do realizacji netto';
export const COORDINATOR_REALIZATION_CONTRACT_ORDER_VALUE_TO_REALIZE_GROSS = 'Pozostała do realizacji brutto';
export const COORDINATOR_REALIZATION_CONTRACT_CONTRACTOR_REPRESENTATIVE = 'Przedstawiciel dostawcy';
export const COORDINATOR_REALIZATION_CONTRACT_CHANGES = 'Zmiany';
export const COORDINATOR_REALIZATION_CONTRACT_PERCENT_REALIZATION_MSG = 'Realizacja umowy przekroczyła 80%';
/* components/modules/coordinator/realization/invoices/invoices.js */
export const COORDINATOR_REALIZATION_INVOICES_TITLE = 'Faktury';
export const COORDINATOR_REALIZATION_INVOICE_NUMBER = 'Numer faktury';
export const COORDINATOR_REALIZATION_INVOICE_SALE_DATE = 'Data sprzedaży';
export const COORDINATOR_REALIZATION_INVOICE_SALE_FROM = 'Data sprzedaży od';
export const COORDINATOR_REALIZATION_INVOICE_SALE_TO = 'Data sprzedaży do';
export const COORDINATOR_REALIZATION_INVOICE_VALUE_NET = 'Wartość netto';
export const COORDINATOR_REALIZATION_INVOICE_VALUE_GROSS = 'Wartość brutto';
export const COORDINATOR_REALIZATION_INVOICE_DELETE_MSG = 'Faktura zostanie usunięta. Czy kontynuować?';
/* components/modules/coordinator/realization/invoices/forms/invoiceForm.js */
export const COORDINATOR_REALIZATION_INVOICE_TITLE_CREATE = 'Nowa faktura';
export const COORDINATOR_REALIZATION_INVOICE_TITLE_EDIT = 'Edycja faktury nr: ';
export const COORDINATOR_REALIZATION_INVOICE_CONTRACTOR = 'Dostawca';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_NAME = 'Nazwa pozycji';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_NET = 'Kwota netto';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_AMOUNT_GROSS = 'Kwota brutto';
export const COORDINATOR_REALIZATION_INVOICE_DESCRIPTION = 'Uwagi';
export const COORDINATOR_REALIZATION_INVOICE_CONTRACT = 'Umowa';
export const COORDINATOR_REALIZATION_INVOICE_PUBLIC_PROCUREMENT_APPLICATION = 'Wniosek o udzielenie zamówienia publicznego';
export const COORDINATOR_REALIZATION_INVOICE_DELETE_POSITION_MSG = 'Pozycja zostanie usunięta. Czy kontynuować?';
/* components/modules/coordinator/realization/invoices/forms/invoicePositionForm.js */
export const COORDINATOR_REALIZATION_INVOICE_POSITION_TITLE_CREATE = 'Nowa pozycja';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_TITLE_EDIT = 'Edycja pozycji';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_COORDINATOR_TYPE = 'Pozycja ujęta w';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_COORDINATOR_PLAN_POSITION = 'Pozycja w ramach planu';
/* components/modules/coordinator/realization/invoices/forms/invoicePositionFormValid.js */
export const COORDINATOR_REALIZATION_INVOICE_POSITION_CONTRACT_VALUE_EXCEEDED = 'Przekroczona wartość umowy';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_PLAN_POSITION_VALUE_EXCEEDED = 'Kwota większa od dostępnej kwoty pozycji w ramach planu';
export const COORDINATOR_REALIZATION_INVOICE_POSITION_VALUE_NET_INVALID = 'Kwota netto większa niż kwota brutto';
/* components/modules/coordinator/realization/expenses/expenses.js */
export const COORDINATOR_REALIZATION_EXPENSES_TITLE = 'Wydatki jednorazowe';
/* components/modules/accountant/accountant.js */
export const ACCOUNTANT = "Księgowy";
export const ACCOUNTANT_MENU_COORDINATOR = 'Koordynator';
export const ACCOUNTANT_MENU_INSTITUTION = 'Instytucja';
export const ACCOUNTANT_MENU_REALIZATION = 'Realizacja';
export const ACCOUNTANT_MENU_DICTIONARIES = 'Słowniki';
export const ACCOUNTANT_SUBMENU_INSTITUTION_PLANS = 'Plany';
export const ACCOUNTANT_SUBMENU_COORDINATOR_PLANS = 'Plany';
export const ACCOUNTANT_SUBMENU_COORDINATOR_PUBLIC_APPLICATIONS = 'Wnioski ZP';
export const ACCOUNTANT_SUBMENU_COORDINATOR_PUBLIC_PROTOCOLS = 'Protokoły ZP';
export const ACCOUNTANT_SUBMENU_COORDINATOR_UPDATES = 'Aktualizacje planów';
export const ACCOUNTANT_SUBMENU_REALIZATION_CONTRACTS = 'Umowy';
export const ACCOUNTANT_SUBMENU_REALIZATION_INVOICES = 'Faktury';
export const ACCOUNTANT_SUBMENU_DICTIONARIES_COST_TYPES = 'Rodzaje kosztów';
export const ACCOUNTANT_SUBMENU_DICTIONARIES_CONTRACTORS = 'Kontrahenci';
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
export const ACCOUNTANT_INSTITUTION_PLANS_UPDATE_TITLE = 'Aktualizacja nr: ';
/* components/modules/accountant/institution/plans/plan.js */
export const ACCOUNTANT_INSTITUTION_POSITION_SEARCH_COST_TYPE = 'Rodzaj kosztu / Nazwa rodzaju kosztu';
export const ACCOUNTANT_INSTITUTION_POSITION_STATUS = 'Status';
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
/* components/modules/accountant/dictionary/forms/generatorCostTypeForm */
export const ACCOUNTANT_COST_TYPE_GENERATOR_TITLE = 'Generator Rodzajów Kosztów';
export const ACCOUNTANT_COST_TYPE_GENERATOR_TARGET_YEAR = 'Rok docelowy';
export const ACCOUNTANT_COST_TYPE_GENERATOR_SOURCE_YEAR = 'Rok źródłowy';
export const ACCOUNTANT_COST_TYPE_GENERATOR_CONFIRM_MSG = 'Zostaną wygenerowane rodzaje kosztów. Czy kontynuować?';
/* components/modules/accountant/dictionary/forms/generatorCostTypeFormValid */
export const ACCOUNTANT_COST_TYPE_GENERATOR_SOURCE_TARGET_YEAR_EQUAL = 'Rok źródłowy i docelowy jest identyczny';
/* components/modules/accountant/dictionary/contractors.js */
export const ACCOUNTANT_CONTRACTORS_TABLE_HEAD_ROW_CODE = 'Kod';
export const ACCOUNTANT_CONTRACTORS_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const ACCOUNTANT_CONTRACTORS_SEARCH_CODE_NAME = 'Kod / Nazwa';
export const ACCOUNTANT_CONTRACTOR_CONFIRM_DELETE_MESSAGE = 'Kontrahent zostanie usuięty. Czy kontynuować?';
/* components/modules/accountant/dictionary/forms/contractorForm.js */
export const ACCOUNTANT_CONTRACTOR_ADD_DETAILS_TITLE = 'Nowy kontrahent';
export const ACCOUNTANT_CONTRACTOR_EDIT_DETAILS_TITLE = 'Edycja kontrahenta: ';
export const ACCOUNTANT_CONTRACTOR_CODE = 'Kod';
export const ACCOUNTANT_CONTRACTOR_NAME = 'Nazwa';
export const ACCOUNTANT_CONTRACTOR_ACTIVE = 'Aktywny';
/* components/modules/director/coordinator/plans/plans.js */
export const DIRECTOR_COORDINATOR_PLAN_TABLE_HEAD_ROW_AMOUNT_REQUESTED_NET = 'Kwota szacowana ZP netto';
export const DIRECTOR_COORDINATOR_PLAN_TABLE_HEAD_ROW_AMOUNT_REQUESTED_GROSS = 'Kwota szacowana brutto';
/* components/modules/director/director.js */
export const DIRECTOR_MENU_PLANS = 'Plany';
export const DIRECTOR_MENU_COORDINATOR_PLANS = 'Plany';
/* components/modules/director/coordinator/plans/planBasicInfoForm.js */
export const DIRECTOR_COORDINATOR_PLAN_TITLE = 'Szczegóły planu: ';
export const DIRECTOR_PLAN_COORDINATOR_CONFIRM_RETURN_MESSAGE = 'Plan zostanie wycofany do Koordynatora. Czy kontynuować?';
/* components/modules/publicProcurement/publicProcurement.js */
export const PUBLIC_MENU_COORDINATOR = 'Koordynator';
export const PUBLIC_SUBMENU_COORDINATOR_PLANS = 'Plany';
export const PUBLIC_SUBMENU_COORDINATOR_APPLICATIONS = 'Wnioski';
export const PUBLIC_SUBMENU_COORDINATOR_UPDATES = 'Aktualizacje planów';
export const PUBLIC_MENU_INSTITUTION = 'Instytucja';
export const PUBLIC_SUBMENU_INSTITUTION_PLANS = 'Plany';
export const PUBLIC_MENU_DICTIONARIES = 'Słowniki';
export const PUBLIC_SUBMENU_DICTIONARIES = 'Słowniki';
/* components/modules/publicProcurement/coordinators/plans/plans.js */
export const PUBLIC_COORDINATOR_PLANS_TITLE = 'Plany Koordynatorów';
export const PUBLIC_COORDINATOR_PLANS_UPDATES_TITLE = 'Aktualizacje Planów Koordynatorów';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_YEAR = 'Rok';
export const PUBLIC_COORDINATOR_PLANS_TABLE_HEAD_ROW_UPDATE_NUMBER = 'Numer aktualizacji';
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
export const PUBLIC_INSTITUTION_PLAN_BUTTON_PRINT_DOUBLE_GROUPS = 'Zdublowane grupy';
export const PUBLIC_INSTITUTION_PLAN_BUTTON_PRINT_UPDATE = 'Aktualizacja';
/* components/modules/accountant/coordinator/publicProcurement/protocols.js */
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOLS_TITLE = 'Protokoły o udzielenie zamówienia publicznego';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOLS_APL_YEAR = 'Rok wniosku';
/*components/modules/hr/humanResources.js*/
export const HR_MENU_EMPLOYEES = 'Personel';
export const HR_MENU_EMPLOYEES_EMPLOYEES = 'Pracownicy';
export const HR_MENU_EMPLOYEES_DICTIONARIES_PLACES = 'Komórki organizacyjne';
export const HR_MENU_EMPLOYEES_DICTIONARIES_WORKPLACES = 'Stanowiska pracy';
/*components/modules/hr/employees/employees.js*/
export const EMPLOYEES_TABLE_HEAD_ROW_ID = 'Id';
export const EMPLOYEES_TABLE_HEAD_ROW_NAME = 'Imię';
export const EMPLOYEES_TABLE_HEAD_ROW_SURNAME = 'Nazwisko';
export const EMPLOYEES_SEARCH_NAME = 'Imię';
export const EMPLOYEES_SEARCH_SURNAME = 'Nazwisko';
export const EMPLOYEES_EMPLOYEE_DELETE_MSG = "Pracownik zostanie usunięty. Czy kontynować?";
/*components/modules/hr/employees/employee.js*/
export const EMPLOYEE_CREATE_NEW_EMPLOYEE_TITLE = 'Nowy pracownik';
export const EMPLOYEE_EDIT_EMPLOYEE_TITLE = 'Edycja pracownika: ';
export const EMPLOYEE_BASIC_INFORMATION = 'Dane podstawowe';
export const EMPLOYEE_EMPLOYMENTS = 'Zatrudnienie';
export const EMPLOYEE_ENTITLEMENTS = 'Uprawnienia';
export const EMPLOYEE_TRAINING = 'Szkolenia';
/*components/modules/hr/employees/forms/employeeBasicInfoForm.js*/
export const EMPLOYEE_BASIC_INFORMATION_ID = 'Id';
export const EMPLOYEE_BASIC_INFORMATION_HR_NUMBER = 'Nr. ewidencyjny';
export const EMPLOYEE_BASIC_INFORMATION_NAME = 'Imię';
export const EMPLOYEE_BASIC_INFORMATION_SURNAME = 'Nazwisko';
export const EMPLOYEE_BASIC_INFORMATION_OU = 'Jednostka organizacyjna';
/*components/modules/hr/employees/forms/employeeEmployments.js*/
export const EMPLOYEE_EMPLOYMENTS_PERIODS = 'Okresy zatrudnienia:';
export const EMPLOYEE_EMPLOYMENTS_TABLE_HEAD_ROW_WORKPLACE = 'Stanowisko';
export const EMPLOYEE_EMPLOYMENTS_TABLE_HEAD_ROW_OU = 'Jednostka';
export const EMPLOYEE_EMPLOYMENTS_DELETE_MSG = 'Zatrudnienie zostanie usunięte. Oświadczenia, upoważnienia oraz informacje o stanowiskach rówież zostaną usunięte. Czy kontynować?';
/* components/modules/hr/employees/employeeEntitlements.js */
export const EMPLOYEE_ENTITLEMENTS_SYSTEMS = 'Lista uprawnień:';
export const EMPLOYEE_ENTITLEMENTS_DELETE_MSG = 'Uprawnienie zostanie usunięte. Czy kontynuować?';
/* components/modules/hr/employees/forms/employeeTrainingForm.js */
export const EMPLOYEE_TRAININGS = 'Ukończone szkolenia:';
export const EMPLOYEE_TRAINING_TABLE_HEAD_ROW_TYPE = 'Rodzaj';
export const EMPLOYEE_TRAINING_TABLE_HEAD_ROW_NAME = 'Nazwa';
export const EMPLOYEE_TRAINING_TABLE_HEAD_ROW_DATE = 'Data';
/* components/modules/hr/employees/forms/employmentForm.js */
export const EMPLOYEE_EMPLOYMENT_DETAILS_TITLE = 'Zatrudnienie - szczegóły pozycji';
export const EMPLOYEE_EMPLOYMENT_DETAILS_ACTIVE = 'Aktywne';
export const EMPLOYEE_EMPLOYMENT_DETAILS_NUMBER = 'Numer umowy / porozumienia';
export const EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_TYPE = 'Rodzaj umowy';
export const EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_DATE = 'Umowa / porozumienie z dnia';
export const EMPLOYEE_EMPLOYMENT_DETAILS_EMPLOYMENT_DATE_FROM = 'Zatrudnienie od';
export const EMPLOYEE_EMPLOYMENT_DETAILS_EMPLOYMENT_DATE_TO = 'Zatrudnienie do';
export const EMPLOYEE_EMPLOYMENT_DETAILS_PROCESS = 'Czy przetwarza';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT = 'Czy oświadczenie wymagane';
export const EMPLOYEE_EMPLOYMENT_DETAILS_UPO = 'Czy UPO wymagane';
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACES = 'Lista stanowisk';
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DELETE_MSG = 'Stanowisko zostanie usunięte. Czy kontynuować?';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATUS = 'Status';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENTS_TITLE = 'Lista oświadczeń';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DELETE_MSG = 'Oświadczenie zostanie usunięte. Czy kontynuować?';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATIONS_TITLE = 'Lista upoważnień';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DELETE_MSG= 'Upoważnienie zostanie usunięte. Czy kontynuować';
/* components/modules/hr/employees/forms/employmentFormValid.js */
export const EMPLOYEE_EMPLOYMENT_DETAILS_CONTRACT_TYPE_HR_NUMBER_UNDEFINED = 'Nie uzupełniono nr ewidencyjnego pracownika w danych podstawowych';
export const EMPLOYEE_EMPLOYMENT_DETAILS_INVALID_DATE = 'Nieprawidłowy okres zatrudnienia';
/* components/modules/hr/employees/forms/workplaceForm.js */
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_TITLE = 'Szczegóły stanowiska';
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_PLACE = 'Komórka organizacyjna';
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_ACTIVE = 'Aktywne';
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DATE_FROM = 'Data od';
export const EMPLOYEE_EMPLOYMENT_DETAILS_WORKPLACE_DATE_TO = 'Data do';
/* components/modules/hr/employees/forms/authorizationForm.js */
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_TITLE = 'Szczegóły upoważnienia';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_ACTIVE = 'Aktywne';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DATE = 'UPO z dnia';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DATE_FROM = 'UPO od';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_DATE_TO = 'UPO do';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_VERIFICATION_DATE = 'Data weryfikacji';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_PROCESSING_BASIS = 'Podstawowa czynność przetwarzania';
export const EMPLOYEE_EMPLOYMENT_DETAILS_AUTHORIZATION_PROCESSING_BASIS_DICTIONARY = 'Podstawy przetwarzania';
/* components/modules/hr/employees/forms/statementForm.js */
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_TITLE = 'Szczegóły oświadczenia';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_ACTIVE = 'Aktywne';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE = 'Oświadczenie z dnia';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE_FROM = 'Oświadczenie od';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_DATE_TO = 'Oświadczenie do';
export const EMPLOYEE_EMPLOYMENT_DETAILS_STATEMENT_VERIFICATION_DATE = 'Data weryfikacji';
/* components/modules/hr/employees/forms/trainingForm.js */
export const EMPLOYEE_TRAINING_DETAILS_TITLE = 'Szkolenie - szczegóły pozycji';
/* components/modules/hr/dictionary/places.js */
export const HR_PLACE_DELETE_MSG = 'Komórka organizacyjna zostanie usunięta. Czy kontynuować?';
export const HR_PLACE_SEARCH_LOCATION = 'Lokalizacja';
/* components/modules/hr/dictionary/placeForm.js */
export const HR_PLACE_CREATE_NEW_PLACE_TITLE = 'Nowa komórka organizacyjna';
export const HR_PLACE_CREATE_NEW_WORKPLACE_TITLE = 'Nowe stanowisko';
export const HR_PLACE_EDIT_PLACE_TITLE = 'Edycja komórki organizacyjnej: ';
export const HR_PLACE_EDIT_WORKPLACE_TITLE = 'Edycja stanowiska: ';
export const HR_PLACE_ACTIVE = 'Aktywna';
export const HR_PLACE_ID = 'Kod';
export const HR_PLACE_NAME = 'Nazwa';
/* components/modules/hr/dictionary/workplaces.js */
export const HR_WORKPLACE_DELETE_MSG = 'Komórka organizacyjna zostanie usunięta. Czy kontynuować?';
export const HR_WORKPLACE_SEARCH_GROUP = 'Grupa zawodowa';
/* components/modules/iod/iod.js */
export const IOD_MENU_REGISTERS = 'Rejestry';
export const IOD_MENU_REGISTERS_CPDO = 'Czynności przetwarzania';
/* components/modules/iod/registers/registers.js */
export const IOD_REGISTERS_TABLE_HEAD_ROW_CODE = 'Kod';
export const IOD_REGISTERS_TABLE_HEAD_ROW_NAME = 'Nazwa';
/* components/modules/iod/registers/forms/regProcessingActivitiesForm.js */
export const IOD_REGISTER_CPDO_UPDATE_USER = 'Użytkownik aktualizujący';
export const IOD_REGISTER_CPDO_UPDATE_DATE = 'Ostatnia aktualizacja';
export const IOD_REGISTER_CPDO_POSITIONS = 'Pozycje rejestru';
export const IOD_REGISTER_CPDO_POSITION_ACTIVE = 'Aktywna';
export const IOD_REGISTER_CPDO_POSITION_NAME = 'Nazwa czynności przetwarzania';
export const IOD_REGISTER_CPDO_POSITION_DATA_SET_CONNECTION = 'Powiązanie ze zbiorem danych';
export const IOD_REGISTER_CPDO_POSITION_PURPOSE_PROCESSING = 'Cel przetwarzania Art.. 30 ust. 1 pkt b';
export const IOD_REGISTER_CPDO_POSITION_CATEGORIES_PEOPLE = 'Kategorie osób Art.. 30 ust. 1 pkt c';
export const IOD_REGISTER_CPDO_POSITION_DATA_CATEGORIES = 'Kategorie danych Art.. 30 ust. 1 pkt c';
export const IOD_REGISTER_CPDO_POSITION_LEGAL_BASIS = 'Podstawa prawna';
export const IOD_REGISTER_CPDO_POSITION_DATA_SOURCE = 'Źródło danych';
export const IOD_REGISTER_CPDO_POSITION_CATEGORY_REMOVAL_DATE = 'Planowany termin usunięcia kategorii danych (jeżeli jest to możliwe) Art.. 30 ust. 1 pkt f';
export const IOD_REGISTER_CPDO_POSITION_CO_ADMINISTRATOR_NAME = 'Nazwa współadministratora i dane kontaktowe (jeśli dotyczy) Art.. 30 ust. 1 pkt a';
export const IOD_REGISTER_CPDO_POSITION_PROCESSOR_NAME = 'Nazwa podmiotu przetwarzającego i dane kontaktowe (jeśli dotyczy) Art.. 30 ust. 1 pkt d';
export const IOD_REGISTER_CPDO_POSITION_RECIPIENT_CATEGORIES = 'Kategorie odbiorców (innych niż podmiot przetwarzający) Art.. 30 ust. 1 pkt d';
export const IOD_REGISTER_CPDO_POSITION_SYSTEM_SOFTWARE_NAME = 'Nazwa systemu lub oprogramowania';
export const IOD_REGISTER_CPDO_POSITION_SECURITY_MEASURES = 'Ogólny opis technicznych i organizacyjnych środków bezpieczeństwa zgodnie z art. 32 ust. 1 (jeżeli jest to możliwe) Art.. 30 ust. 1 pkt g';
export const IOD_REGISTER_CPDO_POSITION_DPIA = 'DPIA (jeśli tak, lokalizacja raportu)';
export const IOD_REGISTER_CPDO_POSITION_THIRD_COUNTRY = 'Transfer do kraju trzeciego lub organizacji międzynarodowej (nazwa kraju i podmiotu) Art. 30 ust. 1 pkt e';
export const IOD_REGISTER_CPDO_POSITION_THIRD_COUNTRY_DOCUMENTATION = 'Transfer do kraju trzeciego lub org. międzynarodowej. Jeśli transfer i art. 49 ust. 1 akapit drugi - dokumentacja odpowiednich zabezpieczeń Art. 30 ust. 1 pkt e';
/* 'components/modules/iod/registers/forms/regProcessingActivitiesPositionForm' */
export const IOD_REGISTER_CPDO_CREATE_NEW_POSITION_TITLE = 'Nowa pozycja';
export const IOD_REGISTER_CPDO_CREATE_EDIT_POSITION_TITLE = 'Edycja pozycji: ';
export const IOD_REGISTER_CPDO_POSITION_OU = 'Komórki organizacyjne';
/* components/modules/asi/asi.js */
export const ASI_MENU_DICTIONARY_SYSTEMS = 'Systemy';
/* components/modules/asi/dictionary/employees/entitlementSystems.js */
export const EMPLOYEE_ENTITLEMENT_SYSTEMS_DELETE_MSG = 'Systemy uprawnień zostanie usunięty. Czy kontynuować?';
/* components/modules/asi/employees/forms/entitlementForm.js */
export const EMPLOYEE_ENTITLEMENT_TITLE = 'Szczegóły uprawnienia';
export const EMPLOYEE_ENTITLEMENT_SYSTEM_NAME = 'Nazwa systemu';
export const EMPLOYEE_ENTITLEMENT_SYSTEM_USERNAME = 'Identyfikator';
export const EMPLOYEE_ENTITLEMENT_PERMISSION_GROUPS = 'Grupy uprawnień';
export const EMPLOYEE_ENTITLEMENT_FROM = 'Data utworzenia konta';
export const EMPLOYEE_ENTITLEMENT_TO = 'Data obowiązywania do';
export const EMPLOYEE_ENTITLEMENT_REVOKE_DATE = 'Data odebrania uprawnień';
export const EMPLOYEE_ENTITLEMENT_VERIFICATION_DATE = 'Data weryfikacji';
export const EMPLOYEE_ENTITLEMENT_CREATED_BY = 'Użytkownik tworzący';
export const EMPLOYEE_ENTITLEMENT_CREATED_AT = 'Data utworzenia';
export const EMPLOYEE_ENTITLEMENT_UPDATED_BY = 'Użytkownik modyfikujący';
export const EMPLOYEE_ENTITLEMENT_UPDATED_AT = 'Data modyfikacji';
export const EMPLOYEE_ENTITLEMENT_CONFIRM_DELETE_PERMISSION_MSG = 'Uprawnienie zostanie usunięte. Czy Kontynuować?';
/* components/modules/asi/employees/forms/entitlementGroupForm.js */
export const EMPLOYEE_ENTITLEMENT_GROUP_TITLE = 'Szczególy grupy uprawnień';
export const EMPLOYEE_ENTITLEMENT_GROUP_NAME = 'Nazwa grupy';
export const EMPLOYEE_ENTITLEMENT_GROUP_ALL_OUS = 'Jednostki organizacyjne';
export const EMPLOYEE_ENTITLEMENT_GROUP_OUS = 'Przypisane jednostki organizacyjne';
/* components/modules/asi/dictionary/employees/forms/entitlementSystemForm.js */
export const ASI_DICTIONARY_SYSTEMS_CREATE_SYSTEM_TITLE = 'Nowy system uprawnień';
export const ASI_DICTIONARY_SYSTEMS_EDIT_SYSTEM_TITLE = 'Edycja systemu uprawnień: ';
export const ASI_DICTIONARY_SYSTEMS_SYSTEM_ACTIVE = 'Aktywny';
export const ASI_DICTIONARY_SYSTEMS_SYSTEM_NAME = 'Nazwa systemu';
export const ASI_DICTIONARY_SYSTEMS_SYSTEM_PERMISSIONS = 'Uprawnienia';
export const ASI_DICTIONARY_SYSTEMS_SYSTEM_PERMISSION_DELETE_MSG = 'Uprawnienie zostanie usunięte. Czy kontynuować?';
/* components/modules/asi/dictionary/employees/forms/entitlementSystemPermissionForm.js */
export const ASI_DICTIONARY_SYSTEM_PERMISSION_CREATE_TITLE = 'Nowe uprawnienie';
export const ASI_DICTIONARY_SYSTEM_PERMISSION_EDIT_TITLE = 'Edycja uprawnienia:';
export const ASI_DICTIONARY_SYSTEM_PERMISSION_NAME = 'Nazwa uprawnienia';
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
export const BUTTON_DETAILS = 'Szczegóły';
export const BUTTON_GENERATE = 'Generuj';
export const BUTTON_SEND_BACK = 'Wycofaj';
export const RADIO_BUTTON_YES = 'Tak';
export const RADIO_BUTTON_NO = 'Nie';
export const TEXTFIELD_SEARCH = 'Szukaj';
export const DRAWER_MENU_SHOW = 'Pokaż';
export const DRAWER_MENU_HIDE = 'Ukryj';
export const APP_HEADER_HOME_BUTTON = 'Start';
export const SELECT_FIELD_ALL = 'Wszystkie';
export const TRANSFER_LIST_ALL_RIGHT = '>>';
export const TRANSFER_LIST_SELECTED_RIGHT = '>';
export const TRANSFER_LIST_ALL_LEFT = '<<';
export const TRANSFER_LIST_SELECTED_LEFT = '<';
export const MENU_DICTIONARIES = 'Słowniki';
export const SEARCH_CODE_NAME = 'Kod / Nazwa';
export const SEARCH_NAME = 'Nazwa';
export const INSTITUTION_PLAN_STATUS_CREATED = 'Utworzony';
export const INSTITUTION_PLAN_STATUS_APPROVED_ACCOUNTANT = 'Akceptacja - Główny księgowy';
export const INSTITUTION_PLAN_STATUS_APPROVED_DIRECTOR = 'Akceptacja  - Dyrektor pionu';
export const INSTITUTION_PLAN_STATUS_APPROVED_ECONOMIC = 'Akceptacja - Dyrektor ekonomiczny';
export const INSTITUTION_PLAN_STATUS_APPROVED_CHIEF = 'Akceptacja - Dyrektor naczelny';
export const INSTITUTION_PLAN_STATUS_APPROVED = 'Zaakceptowany';
export const INSTITUTION_PLAN_STATUS_REALIZED = 'Realizowany';
export const INSTITUTION_PLAN_STATUS_EXECUTED = 'Zrealizowany';
export const INSTITUTION_PLAN_STATUS_UPDATE = 'Zaktualizowany';
export const TABLE_HEAD_ROW_CODE = 'Kod';
export const TABLE_HEAD_ROW_NAME = 'Nazwa';
export const TABLE_HEAD_ROW_ACTIVE = 'Aktywna';
export const TABLE_PAGINATION_PAGE = 'Strona:'
/* public procurement protocol statuses */
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_SAVED = 'Zapisany';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_SEND = 'Wysłany';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_APPROVE_PUBLIC = 'Akceptacja ZP';
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_APPROVE_ACCOUNTANT = "Akceptacja - Główny księgowy";
export const COORDINATOR_PUBLIC_PROCUREMENT_PROTOCOL_EXECUTED = 'Zaakceptowany';
/* hr employee employment types */
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_UPR = 'Umowa o pracę';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_KON = 'Kontrakt';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_WOL = 'Wolontariat';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_STC = 'Staż cząstkowy';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_STP = 'Staż podyplomowy';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_UPO = 'Umowa powierzenia';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_CYW = 'Cywilnoprawna';
export const HR_EMPLOYEE_EMPLOYMENT_TYPE_CYR = 'Cywilnoprawna - tryb pozarezydencki';
/* hr employee employment statuses */
export const HR_EMPLOYEE_EMPLOYMENT_STATUS_NW = 'Nowe';
export const HR_EMPLOYEE_EMPLOYMENT_STATUS_RE = 'Realizowane';
export const HR_EMPLOYEE_EMPLOYMENT_STATUS_ZW = 'Zweryfikowane';
/* common/modalDialog.js */
export const MODAL_DIALOG_ERROR = 'Błąd';
export const MODAL_DIALOG_INFORMATION = 'Informacja';
export const MODAL_DIALOG_WARNING = 'Ostrzeżenie';
export const MODAL_DIALOG_CONFIRM = 'Potwierdzenie';
export const MODAL_DIALOG_FORM_CHANGE_MSG = 'Dane zostały zmodyfikowane. Niezapisane dane zostaną utracone. Czy kontynuować?';
/*common/gui/guiDatePicker.js*/
export const DATE_PICKER_INVALID_DATE_MESSAGE = 'Nieprawidłowa data';
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
export const VAT_DIFF = 'Różny';
export const YEAR = 'Rok';
export const DESCRIPTION = 'Opis';
export const COMMENTS = 'Uwagi';
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