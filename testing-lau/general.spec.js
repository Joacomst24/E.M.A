import { test, expect } from '@playwright/test';

test('recepcion', async ({ page }) => {  await page.goto('/');  await page.getByRole('button', { name: ' Recepción El personal de' }).click();
  await page.getByRole('button', { name: ' Audio asistido Interaccion' }).click();
  await page.getByRole('button', { name: ' Texto visual Mensajes' }).click();
  await page.getByRole('button', { name: ' Guiado por frases El' }).click();
  await page.getByRole('button', { name: ' Volver a pantalla de espera' }).click();
});

test('pantalla espera', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Audio asistido Interaccion' }).click();
  await page.getByRole('button', { name: 'Texto visual Mensajes claros' }).click();
  await page.getByRole('button', { name: 'Guiado por frases El paciente' }).click();
});

test('modo audio', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Audio asistido Interaccion' }).click();
  await page.getByRole('button', { name: 'Activar micrófono. Toque para' }).click();
  await page.getByRole('button', { name: '← Volver al inicio' }).click();
});

test('modo texto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Texto visual Mensajes claros' }).click();
  await page.getByRole('button', { name: ' Registro de paciente' }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: ' Turnos y consultorios' }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: ' Indicaciones generales' }).click();
  await page.getByRole('heading', { name: 'Indicaciones generales' }).click();
  await page.getByText('Use tapabocas si corresponde').click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: ' Indicaciones generales' }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: ' Solicitar asistencia' }).click();
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: '← Volver' }).click();
});

test('modo guiado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Guiado por frases El paciente' }).click();
  await page.getByRole('button', { name: ' Quiero registrarme en' }).click();
  await page.getByRole('button', { name: ' Necesito asistencia de' }).click();
  await page.getByRole('button', { name: ' Tengo una consulta medica' }).click();
  await page.getByRole('textbox', { name: 'Texto para narrador' }).click();
  await page.getByRole('textbox', { name: 'Texto para narrador' }).fill('hola como estas');
  await page.getByRole('button', { name: ' Leer texto escrito' }).click();
  await page.getByRole('button', { name: '← Volver' }).click();
});