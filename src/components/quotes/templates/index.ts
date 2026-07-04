import React from 'react';
import { TemplateRendererProps } from './types';
import TemplateModern from './TemplateModern';
import TemplateClassic from './TemplateClassic';
import TemplatePurpleWave from './TemplatePurpleWave';

export const TEMPLATE_RENDERERS: Record<string, React.FC<TemplateRendererProps>> = {
  modern: TemplateModern,
  classic: TemplateClassic,
  purple_wave: TemplatePurpleWave,
};
