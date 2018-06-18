export const getMessageForGetPositionError = error => {
  switch (error.code) {
    case 1:
      return {
        message: 'Nekad behörighet',
        desc: 'Vi kunde inte hämta din position på grund av att din webbläsare nekade behörighet.',
      };
    case 2:
      return {
        message: 'Misslyckades hämta din position',
        desc: 'Webbläsaren lyckades inte hämta din position. Försök att söka efter en adress.',
      };
    case 3:
      return {
        message: 'Begäran tog för lång tid',
        desc: 'Begäran att hämta din position tog för lång tid. Försök att söka efter en adress.',
      };
  }
};
