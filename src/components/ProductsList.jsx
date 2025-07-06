import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../products_state/productSlice";
import Header from "./Header";
import Spinner from "./Spinner";
import Error from "./Error";
import ProductItem from "./ProductItem";
import ProductFormDialog from "./Form";

function ProductsList() {
    const { products, isLoading, error } = useSelector((state) => state.products);
    const [isFormOpened, setIsFormOpened] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({})
    const dispatch = useDispatch();

    function handleEdit(product){
        setCurrentProduct(product);
        setIsFormOpened(true);
    }

    useEffect(function(){
        dispatch(fetchProducts());
    }, [dispatch]);

    if (isLoading) return <div>Loading products...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header addProduct={() => {setCurrentProduct(null); setIsFormOpened(true);}}/>
            {isLoading && <Spinner/>}
            {!isLoading && !error && products.map(product => 
                <div className="grid gap-6
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    auto-rows-fr p-6"
                >
                    <ProductItem onEdit={handleEdit} details={product}/>
                </div>
                
            )}
            {error && <Error message={error}/>}{isFormOpened && 
                <ProductFormDialog
                    initialProduct={currentProduct}
                    onCancel={() => setIsFormOpened(false)}
                    onSuccess={() => {
                        setIsFormOpened(false)
                    }}
                />
            }
        </>
    )
}

export default ProductsList;



