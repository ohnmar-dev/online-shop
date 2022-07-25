const deleteProduct=(btn)=>{
    const prodId=btn.parentNode.querySelector('[name=productId]').value;
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    
    fetch('/admin/products/'+prodId,{
        method:'delete',
        headers:{
            'csrf-token':csrf
        }
    }).then(result=>{
        console.log(result)
    })
        .catch(err=>console.log(err))

}