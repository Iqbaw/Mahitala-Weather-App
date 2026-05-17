export const downloadTokenAsFile = (token, username) => {
  const fileContent = `
# ======================================================
# KUNCI AKSES AKUN MAHTALA ANDA
# JANGAN BAGIKAN FILE INI KEPADA SIAPAPUN!
# ======================================================
#
# Nama Pengguna: ${username}
#
# Simpan file ini di tempat yang aman. Anda akan 
# membutuhkan token di bawah ini untuk masuk ke akun Anda.
#
# Token Akses:
${token}
  `;

  const blob = new Blob([fileContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  
  const fileName = `mahitala-access-key-${username}.key`;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export const parseCredentialsFromFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.name.endsWith('.key')) {
      reject(new Error('File tidak valid. Harap pilih file dengan ekstensi .key'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      
      const usernameMatch = fileContent.match(/# Nama Pengguna:\s*(\S+)/);
      const tokenMatch = fileContent.match(/# Token Akses:\s*(\S+)/);

      if (usernameMatch && usernameMatch[1] && tokenMatch && tokenMatch[1]) {
        const credentials = {
          username: usernameMatch[1],
          token: tokenMatch[1],
        };
        resolve(credentials);
      } else {
        reject(new Error('Format file kunci tidak valid atau data tidak ditemukan.'));
      }
    };

    reader.onerror = (error) => {
      reject(new Error('Gagal membaca file.'));
    };

    reader.readAsText(file);
  });
}