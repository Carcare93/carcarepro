
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return t('language.english');
      case 'es': return t('language.spanish');
      case 'fr': return t('language.french');
      case 'it': return t('language.italian');
      default: return code;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <Globe className="h-5 w-5 transition-colors group-hover:text-primary" />
          <span className="sr-only">{t('language.select')}</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary text-[8px] flex items-center justify-center text-white font-bold">
            {currentLanguage.slice(0, 2)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={currentLanguage.startsWith('en') ? "bg-secondary/50" : ""}
        >
          {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('es')}
          className={currentLanguage.startsWith('es') ? "bg-secondary/50" : ""}
        >
          {t('language.spanish')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('fr')}
          className={currentLanguage.startsWith('fr') ? "bg-secondary/50" : ""}
        >
          {t('language.french')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('it')}
          className={currentLanguage.startsWith('it') ? "bg-secondary/50" : ""}
        >
          {t('language.italian')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
