export enum AuditAction {
  LOGIN = 'login',
  LOGOUT = 'logout',
  BID_PLACED = 'lance_realizado',
  BID_CANCELLED = 'lance_cancelado',
  AUCTION_STARTED = 'leilao_iniciado',
  AUCTION_ENDED = 'leilao_encerrado',
  USER_BLOCKED = 'usuario_bloqueado',
  USER_UNBLOCKED = 'usuario_desbloqueado',
}
