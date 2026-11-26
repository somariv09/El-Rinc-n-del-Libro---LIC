var tienda=angular.module('tiendaApp', [])

tienda.controller('ProductosController', function($scope, $http){
    $scope.productos=[];
    $scope.categorias=[];
    $scope.categoriaSeleccionada='Todas';
    $scope.buscar='';
    $scope.cargando=true;
    $scope.errorCarga = false;

    //Conectar la api
    $http.get('https://fakestoreapi.com/products')
    .then(function(respuesta){
        $scope.productos=respuesta.data;

        var categoriasU=[];
        $scope.productos.forEach(function(producto){
            //Buscamos si la categoría ya existe y si no la añadimos
            if (categoriasU.indexOf(producto.category)===-1){
                categoriasU.push(producto.category)
            }
        });

        $scope.categorias=categoriasU;
    })
    .catch(function(error){
        $scope.errorCarga = true;
        console.error('Error al cargar los productos:', error);
    })

    .finally(function(){
        $scope.cargando=false;
    });
    //Mostramos solo la categoria filtrada
    $scope.seleccionarCategoria=function(categoria){
        $scope.categoriaSeleccionada=categoria;
    }

    $scope.productoSeleccionado=null;

    $scope.verDetalle = function(producto){
        $scope.productoSeleccionado=producto;
    }

    $scope.carrito=[];
    $scope.totalCarrito=0;

    $scope.agregarCarrito=function(producto){
        //Se recorre el arreglo buscando coincidencias
        var productoExistente=$scope.carrito.find(function(item){
            return item.id===producto.id;
        });

        if(productoExistente){
            productoExistente.cantidad++
        }
        else{
            var nuevoProducto=angular.copy(producto);

            nuevoProducto.cantidad=1;
            $scope.carrito.push(nuevoProducto);
        }
        $scope.actualizarTotal();
    };

    $scope.actualizarTotal=function(){
        $scope.totalCarrito=0;

        $scope.carrito.forEach(function(item){
            $scope.totalCarrito+=item.price*item.cantidad;
        });
    };

    $scope.eliminarCarrito=function(index){
        $scope.carrito.splice(index, 1);
        $scope.actualizarTotal();
    }

    $scope.mensajePagar="";

    $scope.pagar=function(){
        if ($scope.carrito.length===0){
            return;
        }

        var totalPagado=$scope.totalCarrito;

        $scope.mensajePagar='Su compra fue realizada con exito. El total del pago fue de: $'+totalPagado.toFixed(2);

        $scope.carrito=[];

        $scope.actualizarTotal();

        var modalCarrito = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
        if (modalCarrito) {
            modalCarrito.hide();
        }

        var modalPago = new bootstrap.Modal(document.getElementById('modalPago'));
        modalPago.show();
    };
});