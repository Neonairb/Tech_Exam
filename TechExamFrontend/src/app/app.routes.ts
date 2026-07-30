import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { EmpleadosList } from './pages/empleados/empleados-list/empleados-list';
import { EmpleadoForm } from './pages/empleados/empleado-form/empleado-form';
import { MovimientosList } from './pages/movimientos/movimientos-list/movimientos-list';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'home',
                component: Home
            },
            {
                path: 'empleados/crear',
                component: EmpleadoForm
            },
            {
                path: 'empleados/editar/:id',
                component: EmpleadoForm
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
