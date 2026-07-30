import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { EmpleadosList } from './pages/empleados/empleados-list/empleados-list';
import { EmpleadoForm } from './pages/empleados/empleado-form/empleado-form';
import { MovimientosList } from './pages/movimientos/movimientos-list/movimientos-list';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: 'empleados',
                component: EmpleadosList
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
                path: 'movimientos',
                component: MovimientosList
            },
            {
                path: '',
                redirectTo: 'empleados',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'empleados'
    }
];
