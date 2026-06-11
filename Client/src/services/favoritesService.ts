const KEY = "makany.favorites";

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function write(ids: string[]) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export const favoritesService = {
  list(): string[] {
    return read();
  },
  has(id: string): boolean {
    return read().includes(id);
  },
  toggle(id: string): boolean {
    const ids = read();
    const i = ids.indexOf(id);
    if (i >= 0) ids.splice(i, 1);
    else ids.push(id);
    write(ids);
    return ids.includes(id);
  },
};