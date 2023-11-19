import { Roles } from './roles.model';
import { Funcionalidades } from './funcionalidades.model';

export class UsuarioRoles{
    user_RolId: number | undefined;
    userId: number | undefined;
    rolId: number | undefined;
    roles: Roles | undefined;
    funcionalityId: number | undefined;
    funcionality: Funcionalidades | undefined;
}