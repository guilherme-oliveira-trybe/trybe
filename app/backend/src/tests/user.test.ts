import * as chai from 'chai';
import * as Sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import Users from '../database/models/User';
import { Response } from 'superagent';
import CustomError from '../errors/CustomError';

chai.use(chaiHttp);

const { expect } = chai;

describe('Rota /login', () =>{
  describe('POST', () => {
    describe('Caso usuário encontrado', () => {
      before(() => {
        Sinon.stub(Users, 'findOne').resolves({
          id: 1,
          username: 'Admin',
          role: 'admin',
          email: 'admin@admin.com',
          password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
        } as Users)
      })
  
      after(() => {
        (Users.findOne as Sinon.SinonStub).restore();
      })
  
      it('Se email e password correto, retorna status 200 e contém a propriedade token', async () => {
        const response: Response = await chai.request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin'});
  
        expect(response.status).to.be.equal(200);
        expect(response.body).to.have.property('token');
      })

      // it('Se password incorreto, retorna erro', async () => {
      //   const response: Response = await chai.request(app)
      //   .post('/login')
      //   .send({ email: 'admin@admin.com', password: 'asenhataerrada' });
  
      //   expect(response.status).to.be.equal(401);
      //   expect(response.body).to.deep.equal({ message: 'Incorrect email or password'});
      // })
    })

    describe('Teste em caso de usuário não encontrado', () => {
      before(() => {
        Sinon.stub(Users, 'findOne').resolves(undefined);
      })
  
      after(() => {
        (Users.findOne as Sinon.SinonStub).restore();
      })

      it('Verifica lançamento de erro, caso email incorreto', async () => {
        const response: Response = await chai.request(app)
        .post('/login')
        .send({ email: 'emailerrado@admin.com', password: 'secret_admin'});
  
        expect(response.status).to.be.equal(401);
        expect(response.body).to.deep.equal({ message: 'Incorrect email or password'});
      })
    })

    describe('Teste em caso de não preencimento correto do body da requisição', () => {
      it('Verifica lançamento de erro, caso não seja passado email', async () => {
        const response: Response = await chai.request(app)
        .post('/login')
        .send({ password: 'secret_admin' });
  
        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({ message: '"email" is required'});
      })

      it('Verifica lançamento de erro, caso não seja passado password', async () => {
        const response: Response = await chai.request(app)
        .post('/login')
        .send({ email: 'admin@admin.com' });
  
        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({ message: '"password" is required'});
      })

      it('Verifica lançamento de erro, caso não seja passado email e/ou password vazios', async () => {
        const response: Response = await chai.request(app)
        .post('/login')
        .send({ email: '', password: '' });
  
        expect(response.status).to.be.equal(400);
        expect(response.body).to.deep.equal({ message: 'All fields must be filled'});
      })
    })
  })

  describe('GET', () => {
    before(() => {
      Sinon.stub(Users, 'findOne').resolves({
        role: 'admin',
      } as Users)
    })

    after(() => {
      (Users.findOne as Sinon.SinonStub).restore();
    })

    it('Retorna status 200 e contém a propriedade role', async () => {
      const response: Response = await chai.request(app)
      .get('/login/validate')
      .send({ email: 'admin@admin.com' })
      .set({'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY2NDgxNzUwNywiZXhwIjoxNjY0OTAzOTA3fQ.mSEK9ndX-k4i85QDOsk0TSnjgkQM6S-lKKsmstdQJ-8'});

      expect(response.status).to.be.equal(200);
      expect(response.body).to.have.property('role');
    })
  })
})