export enum UserRole {
    EMPLOYEE = "employee",
    EMPLOYER = "employer",
    ADMIN = "admin",
}

export enum EnumGender {
    WOMAN = "woman",
    MAN =  "man"
}

export enum EnumCitizenship {
  UZBEKISTAN = 'UZ',
  USA = 'US',
  RUSSIA = 'RU',
  KAZAKHSTAN = 'KZ',
  GERMANY = 'DE',
  TURKEY = 'TR',
  KOREA = 'KR',
  UK = 'GB',
}


export const CountryRegions: Record<EnumCitizenship, string[]> = {
  [EnumCitizenship.UZBEKISTAN]: [
    "Toshkent", "Samarqand", "Buxoro", "Andijon", "Farg'ona", 
    "Namangan", "Navoiy", "Qashqadaryo", "Surxondaryo", "Jizzax", 
    "Sirdaryo", "Xorazm", "Qoraqalpog'iston R."
  ],
  [EnumCitizenship.USA]: ["California", "Texas", "New York", "Florida", "Illinois"],
  [EnumCitizenship.RUSSIA]: ["Moskva", "Sankt-Peterburg", "Novosibirsk", "Ekaterinburg"],
  [EnumCitizenship.KAZAKHSTAN]: ["Ostona", "Almati", "Chimkent"],
  [EnumCitizenship.GERMANY]: ["Berlin", "Munich", "Hamburg"],
  [EnumCitizenship.TURKEY]: ["Istanbul", "Ankara", "Antalya"],
  [EnumCitizenship.KOREA]: ["Seoul", "Busan", "Incheon"],
  [EnumCitizenship.UK]: ["London", "Manchester", "Birmingham"],
} as const; 
