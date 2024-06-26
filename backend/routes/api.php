<?php

use App\Http\Controllers\AmistadController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\JuegoController;
use App\Http\Controllers\MensajeController;
use App\Http\Controllers\PuntajeController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\FavoritoController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

/* Login-Logout-Register-Forgot Password */
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout']); // quiza se deba usar laravel sanctum para esto
Route::post('/register', [UsuarioController::class, 'createUser']);
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

/* Usuarios */
Route::middleware('auth:sanctum')->get('/user', [UsuarioController::class, 'getAuthUser']);
Route::get('/users', [UsuarioController::class, 'getAllUsers']);
Route::get('/users/{id}', [UsuarioController::class, 'getUserById']);
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/user', [UsuarioController::class, 'updateUser']);
    Route::delete('/user', [UsuarioController::class, 'deleteUser']);
}); // para que solo el mismo usuario pueda modificar o eliminar su cuenta

/* Juegos */
Route::get('/juegos', [JuegoController::class, 'index']);
Route::get('/juegos/{id}', [JuegoController::class, 'getJuegoById']);
Route::post('/juegos', [JuegoController::class, 'crearJuego']);
Route::put('/juegos/{id}', [JuegoController::class, 'modificarJuego']);
Route::delete('/juegos/{id}', [JuegoController::class, 'eliminarJuego']);

/* Categorías */
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/categorias/{id}', [CategoriaController::class, 'getCategoriaById']);
Route::post('/categorias', [CategoriaController::class, 'crearCategoria']);
Route::put('/categorias/{id}', [CategoriaController::class, 'modificarCategoria']);
Route::delete('/categorias/{id}', [CategoriaController::class, 'eliminarCategoria']);

/* Puntajes */
Route::get('/puntajes/{id}/all', [PuntajeController::class, 'allPuntajes']);
Route::get('/puntajes/{id}/top', [PuntajeController::class, 'topDiezPuntajes']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/puntajes/mayor', [PuntajeController::class, 'mayorPuntajeUsuario']);
    Route::post('/puntajes/{juegoId}', [PuntajeController::class, 'crearOActualizarPuntaje']);
}); // complicado testearlos con postman por token, testear por front

/* Amistad */ // para esto es necesario que hayan al menos dos usuarios registrados mediante el sistema y no por inserts
Route::get('/users/{id}/amigos', [AmistadController::class, 'getAmigos']);
Route::post('/amistad', [AmistadController::class, 'store']);
Route::delete('/amistades/{id}', [AmistadController::class, 'eliminarAmistad']);

/* Mensajes */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/mensajes/global', [MensajeController::class, 'indexGlobal']);
    Route::get('/mensajes/private/{user}', [MensajeController::class, 'indexPrivate']);
    Route::post('/mensajes', [MensajeController::class, 'store']);
});

/* (juegos) Favoritos */
Route::post('/favoritos', [FavoritoController::class, 'agregarFavorito']);
Route::delete('/favoritos', [FavoritoController::class, 'borrarFavorito']);


/* rutas adicionales */
