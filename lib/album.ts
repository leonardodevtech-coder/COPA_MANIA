import AsyncStorage from '@react-native-async-storage/async-storage';
import selecoesData from '../data/selecoes.json';

// Toda a economia do app (medalhas, taças, figurinhas, lendas) vive dentro do
// mesmo objeto de usuário já usado por login/cadastro/profile.
const KEY = '@copamania_user';

export interface Figurinha {
  fotoUri: string | null;
}

export interface AlbumUser {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  medalhas: number;
  tacas: number;
  figurinhas: Record<string, Figurinha>; // chave = "selecaoId:index"
  lendas: Record<string, boolean>; // chave = id da lenda
}

export interface Slot {
  key: string;
  nome: string;
  selecao: string;
  selId: number;
  idx: number;
  posicao: string;
  altura: string;
  peso: string;
  cor: string; // cor principal da seleção
}

const DEFAULTS = { medalhas: 0, tacas: 0 };

export async function getUser(): Promise<AlbumUser> {
  const raw = await AsyncStorage.getItem(KEY);
  const u = raw ? JSON.parse(raw) : {};
  return {
    ...DEFAULTS,
    ...u,
    medalhas: u.medalhas ?? 0,
    tacas: u.tacas ?? 0,
    figurinhas: u.figurinhas ?? {},
    lendas: u.lendas ?? {},
  };
}

async function save(u: AlbumUser) {
  await AsyncStorage.setItem(KEY, JSON.stringify(u));
}

export async function addMedalhas(n: number): Promise<AlbumUser> {
  const u = await getUser();
  u.medalhas += n;
  await save(u);
  return u;
}

// Lista achatada de todos os slots de jogadores (todas as seleções).
export function todosOsSlots(): Slot[] {
  const out: Slot[] = [];
  (selecoesData as any).selecoes.forEach((s: any) => {
    s.jogadores.forEach((j: any, idx: number) => {
      out.push({
        key: `${s.id}:${idx}`,
        nome: j.nome,
        selecao: s.nome,
        selId: s.id,
        idx,
        posicao: j.posicao ?? '',
        altura: j.altura ?? '',
        peso: j.peso ?? '',
        cor: s.cores?.principal ?? '#E0B953',
      });
    });
  });
  return out;
}

// Gasta 1 medalha e revela um jogador aleatório ainda não obtido (modelo "pacote").
export async function abrirPacote(): Promise<{ ok: boolean; jogador?: Slot; motivo?: 'sem_medalha' | 'completo' }> {
  const u = await getUser();
  if (u.medalhas < 1) return { ok: false, motivo: 'sem_medalha' };
  const bloqueados = todosOsSlots().filter((s) => !u.figurinhas[s.key]);
  if (bloqueados.length === 0) return { ok: false, motivo: 'completo' };
  const escolhido = bloqueados[Math.floor(Math.random() * bloqueados.length)];
  u.medalhas -= 1;
  u.figurinhas[escolhido.key] = { fotoUri: null };
  await save(u);
  return { ok: true, jogador: escolhido };
}

export async function setFotoJogador(key: string, fotoUri: string): Promise<AlbumUser> {
  const u = await getUser();
  u.figurinhas[key] = { fotoUri };
  await save(u);
  return u;
}

// Ao final de qualquer quiz (um tema ou o completo): 100% de acertos concede 1 taça.
export async function concluirQuiz(
  acertos: number,
  total: number
): Promise<{ ganhouTaca: boolean; user: AlbumUser }> {
  const u = await getUser();
  const ganhou = total > 0 && acertos === total;
  if (ganhou) u.tacas += 1;
  await save(u);
  return { ganhouTaca: ganhou, user: u };
}

// Gasta 1 taça para desbloquear a lenda escolhida.
export async function desbloquearLenda(
  id: string
): Promise<{ ok: boolean; motivo?: 'sem_taca' | 'ja_tem' }> {
  const u = await getUser();
  if (u.lendas[id]) return { ok: false, motivo: 'ja_tem' };
  if (u.tacas < 1) return { ok: false, motivo: 'sem_taca' };
  u.tacas -= 1;
  u.lendas[id] = true;
  await save(u);
  return { ok: true };
}
