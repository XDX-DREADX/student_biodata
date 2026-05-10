export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxf3laINhVs1ubLtDTdNRQ7_U9Zyjw3waZHhKKGg89RILN5n37wSAqo4Ma1PgTQiFiwjA/exec'; // TODO: Replace with your Google Apps Script Web App URL

export interface Biodata {
  namaLengkap: string;
  nisn: string;
  jenisKelamin: string;
  tanggalLahir: string;
}

export async function submitBiodata(data: Biodata): Promise<boolean> {
  if (!SCRIPT_URL) {
    // Simulate network delay for local testing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Local submission simulated:', data);
    return true;
  }

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      // mode: 'no-cors' might be required depending on GAS setup, but it prevents reading response.
      // If we use simple stringified JSON, sometimes 'text/plain' content type avoids preflight.
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
    });

    // If using no-cors, response.ok is false and status is 0. 
    // We assume true if no error is thrown.
    return true;
  } catch (error) {
    console.error('Error submitting biodata:', error);
    throw error;
  }
}

export async function fetchBiodata(): Promise<Biodata[]> {
  if (!SCRIPT_URL) {
    return [];
  }

  try {
    const response = await fetch(SCRIPT_URL);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data as Biodata[];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}
