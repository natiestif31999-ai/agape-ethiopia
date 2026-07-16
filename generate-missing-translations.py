#!/usr/bin/env python3
"""
Translation Completion Script
Adds missing translations for all non-English languages
"""

import re
import sys

# Translation mappings for missing keys
TRANSLATIONS = {
    "beneficiaryRegistration": {
        "en": "Beneficiary Registration",
        "am": "ተከታታይ ተጠቃሚ ምዝገባ",
        "om": "Galmee Fayyadamtoota",
        "ti": "ተከታታይ ተጠቃሚ ምዝገባ"
    },
    "equipmentTracking": {
        "en": "Equipment Tracking",
        "am": "የሚዣወቂ ያገናዘብ ስርዓት",
        "om": "Hordofiin Meeshaa",
        "ti": "ሜሪ ዓይነት ሪብርብ"
    },
    "assessmentManagement": {
        "en": "Assessment Management",
        "am": "የመገምገም አስተዳደር",
        "om": "Bulchiinsa Madaallii",
        "ti": "ምዝግባር ስርዓት"
    },
    "ourMission": {
        "en": "Our Mission",
        "am": "ኛኞ ሙሴያ",
        "om": "Hamaaginaan Keenyaa",
        "ti": "ስራ መንግስተ"
    },
    "ourMissionTitle": {
        "en": "Our Mission",
        "am": "ኛኞ ሙሴያ",
        "om": "Hamaaginaan Keenyaa",
        "ti": "ስራ መንግስተ"
    },
    "ourMissionText": {
        "en": "Provide compassionate mobility assistance and comprehensive beneficiary support services across Ethiopia.",
        "am": "በሙሉ ኢትዮጵያ ውስጥ ምህረታዊ ተንቀሳቅሳታዊ ረዳት እና ሰፊ ተከታታይ ተጠቃሚ ድጋፍ ስርዓቶችን ማቅረብ",
        "om": "Gargaarsa mobiliteeffaa hawwii fi tajaajila deeggarsa fayyadamtootaa guutuu Itoophiyaa keessatti kennuu",
        "ti": "በሙሉ ኢትዮጵያ ውስጥ ምህረታዊ ተንቀሳቅሳታዊ ረዳት እና ሰፊ ተከታታይ ተጠቃሚ ድጋፍ ሰርቃዊ ሥራ መስጠት"
    },
    "ourReach": {
        "en": "Our Reach",
        "am": "ኛኞ ደርሳታ",
        "om": "Hantuutti Keenyaa",
        "ti": "ሓበሬታ ወሰናትናታ"
    },
    "ourReachTitle": {
        "en": "Our Reach",
        "am": "ኛኞ ደርሳታ",
        "om": "Hantuutti Keenyaa",
        "ti": "ሓበሬታ ወሰናትናታ"
    },
    "ourReachText": {
        "en": "Visualizing our recent outreach and beneficiary impact.",
        "am": "ኛኞ ታሪክ ውጪ እንቅስቃሴዎችና ተከታታይ ተጠቃሚ ውጤትን ምስል ይሁኑ",
        "om": "Fakkaasuu gargaarsa kana jidha fi midhaan fayyadamtootaa",
        "ti": "ስራ ውጪ ምግላጽ ተከታታይ ተጠቃሚ ውጤት ምሉእ"
    },
    "operationalDashboard": {
        "en": "Operational Dashboard",
        "am": "የስራ ሳሙና ጣቢያ",
        "om": "Daashboordii Hojii",
        "ti": "ሥራ ሌላ ሳሙና ጣቢያ"
    },
    "dashboardDescription": {
        "en": "The interface provides comprehensive tracking of impact metrics, donations, requests, and administrative oversight with real-time Supabase integration.",
        "am": "ይህ ፊቅ ሙሉ ውጤት መለኪያዎች ፣ ሞሥዋ ፣ ጥያቄዎች እና የአስተዳደር ገምገም እና በእውነተኛ ጊዜ Supabase ተዋሃዶን ሙሉ ጎናዊ ዛቢያ ይሰጣል",
        "om": "Ifa kana dandeettii gabaasa midhaa guutuu, haadhaa, gaaffii fi guddina bulchiinsaa fi walnyaatinsa real-time Supabase siif kenna",
        "ti": "ይህ ፊቅ ሙሉ ውጤት መሊእ ፣ ሞሥዋ ፣ ጥያቄዎች እና የአስተዳደር ገምገም እና በእውነተኛ ጊዜ Supabase ተዋሃዶን ሙሉ ጎናዊ ዛቢያ ይሰጣል"
    },
    "selfRegistrationCard": {
        "en": "Self registration",
        "am": "ራሱን ትምህርት ምዝገባ",
        "om": "Galmee Seeraa",
        "ti": "ራሱን ትምህርት ምዝገባ"
    },
    "selfRegistrationTitle": {
        "en": "Self registration",
        "am": "ራሱን ትምህርት ምዝገባ",
        "om": "Galmee Seeraa",
        "ti": "ራሱን ትምህርት ምዝገባ"
    },
    "selfRegistrationText": {
        "en": "Beneficiaries can submit their full profile, contact details, and photo directly.",
        "am": "ተከታታይ ተጠቃሚ እነሱን ሙሉ ስሙ ፣ ርክክ ዋቢዎች እና ፎቶ በቀጥታ ስሠርት ይችላሉ",
        "om": "Fayyadamtoonni fuula guutuu isaa, xiinxala quunnamtii fi footon kallattii ergaa dandeenya",
        "ti": "ተከታታይ ተጠቃሚ ሙሉ ስሙ ፣ ርክክ ዋቢዎች እና ፎቶ በቀጥታ ክፈሎ ይገታ"
    },
    "staffPanelCard": {
        "en": "Staff panel",
        "am": "ሠራተኛ ጣቢያ",
        "om": "Bulchiinsa Hojjetaa",
        "ti": "ሠራተኛ ጣቢያ"
    },
    "staffPanelTitle": {
        "en": "Staff panel",
        "am": "ሠራተኛ ጣቢያ",
        "om": "Bulchiinsa Hojjetaa",
        "ti": "ሠራተኛ ጣቢያ"
    },
    "staffPanelText": {
        "en": "Staff can save, review, edit, and manage beneficiary registrations and workflow actions.",
        "am": "ሠራተኛ ተከታታይ ተጠቃሚ ምዝገበዎች እና ሥራ ፍሰት ስራዎች መቀመጥ ፣ ግምገማ ፣ ያርትዋ እና ምግባር ይችላሉ",
        "om": "Hojjetan itti galmee fayyadamtootaa fi hojii raabsaa konkolaataa, ilaalcha, gulaaluu fi bulchiisuu dandeenya",
        "ti": "ሠራተኛ ተከታታይ ተጠቃሚ ምዝገበዎች እና ሥራ ፍሰት ስራዎች መቀመጥ ፣ ግምገማ ፣ ያርትዋ እና ምግባር ይገታ"
    },
    "adminPanelCard": {
        "en": "Admin panel",
        "am": "አስተዳደር ጣቢያ",
        "om": "Bulchiinsa",
        "ti": "አስተዳደር ጣቢያ"
    },
    "adminPanelTitle": {
        "en": "Admin panel",
        "am": "አስተዳደር ጣቢያ",
        "om": "Bulchiinsa",
        "ti": "አስተዳደር ጣቢያ"
    },
    "adminPanelText": {
        "en": "Administrators can manage users, site content, and the wider system from one place.",
        "am": "አስተዳዳሪዎች ተጠቃሚዎች ፣ ጣቢያ ይዘት እና ሰፊ ስርዓትን ከአንድ ቦታ ማስተዳደር ይችላሉ",
        "om": "Bulchisoonni fayyadamtootaa, qabeentoota giddu galeessa fi sirna guddaa bakka tokkosta bulchiisuu dandeenya",
        "ti": "አስተዳዳሪዎች ተጠቃሚዎች ፣ ጣቢያ ይዘት እና ሰፊ ስርዓትን ከአንድ ቦታ ማስተዳደር ይገታ"
    },
    "openRequests": {
        "en": "Open requests",
        "am": "ክፍት ጥያቄዎች",
        "om": "Gaaffii Buufate",
        "ti": "ክፍት ጥያቄዎች"
    },
    "availableWheelchairs": {
        "en": "Available wheelchairs",
        "am": "የሚገኝ መንኮራኩር",
        "om": "Gare jidhaadha",
        "ti": "የሚገኝ መንኮራኩር"
    },
    "beneficiary": {
        "en": "Beneficiary",
        "am": "ተከታታይ ተጠቃሚ",
        "om": "Fayyadamaa",
        "ti": "ተከታታይ ተጠቃሚ"
    },
    "item": {
        "en": "Item",
        "am": "ነገር",
        "om": "Meeshaa",
        "ti": "ነገር"
    },
    "status": {
        "en": "Status",
        "am": "ሁኔታ",
        "om": "Haala",
        "ti": "ሁኔታ"
    },
    "unnamed": {
        "en": "Unnamed",
        "am": "ስም አልባ",
        "om": "Maqaa hin jidu",
        "ti": "ስም አልባ"
    },
    "statusPending": {
        "en": "Pending",
        "am": "በመጠበቅ ላይ",
        "om": "Eegaa",
        "ti": "በመጠበቅ ላይ"
    },
    "statusMatched": {
        "en": "Matched",
        "am": "ተስማሚ",
        "om": "Walfidhaa",
        "ti": "ተስማሚ"
    },
    "statusDelivered": {
        "en": "Delivered",
        "am": "ተሰጠ",
        "om": "Kenname",
        "ti": "ተሰጠ"
    }
}

def main():
    # This script demonstrates the missing translations
    # The actual fix will be applied directly to the translations file
    
    print("=" * 70)
    print("Missing Translation Keys - Amharic, Oromo, and Tigrinya")
    print("=" * 70)
    print()
    
    for key, trans in sorted(TRANSLATIONS.items()):
        print(f'"{key}": {{')
        print(f'  "en": "{trans["en"]}",')
        print(f'  "am": "{trans["am"]}",')
        print(f'  "om": "{trans["om"]}",')
        print(f'  "ti": "{trans["ti"]}"')
        print('},')
        print()

if __name__ == "__main__":
    main()
