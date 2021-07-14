const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector('[name=productID]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    fetch('/admin/product/' + productID, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => console.log(err));
};