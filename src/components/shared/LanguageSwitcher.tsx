
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
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return t('language.english');
      case 'es': return t('language.spanish');
      case 'fr': return t('language.french');
      default: return code;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('language.select')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('es')}>
          {t('language.spanish')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('fr')}>
          {t('language.french')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
