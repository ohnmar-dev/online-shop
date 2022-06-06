const fs=require('fs');
const requestHandler=(req,res)=>{
    const url=req.url;
    const method=req.method;
    if(url==='/'){
        res.setHeader('Content-Type','text/html')
    res.write('<html>')
    res.write('<head><title>My App</title><body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body></head>')
    res.write('</html>')
    return res.end();
    }
    if(url==='/message' && method==='POST'){
        const body=[];
        req.on('data',(chunk)=>{
            console.log(chunk);
            body.push(chunk);
        })
        return req.on('end',()=>{
            const parseBody=Buffer.concat(body).toString();
            console.log(parseBody)
             const newmessage=parseBody.split('=')[1];
            fs.writeFileSync('message.txt',newmessage);
            res.statusCode=302;
            res.setHeader('location','/');
            return res.end()
        })
        
       
    }

    res.write("<h1>Hello World</h1>")
    res.end();
}
module.exports=requestHandler