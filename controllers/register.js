const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            console.log("1");
            trx.insert({
              hash: hash,
              email: email  
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                console.log("2");
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                })
                .then(user => {
                    console.log("3");
                    res.json(user[0]);
                })
            })
            .then(x => {
                trx.commit
                onsole.log("5"); 
                })
            .catch(x => {
                trx.rollback
                console.log("6");
                })
            console.log("4");
        })
        .catch(err => res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};

