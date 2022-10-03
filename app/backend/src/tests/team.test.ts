import * as chai from 'chai';
import * as Sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import Teams from '../database/models/Team';
import { Response } from 'superagent';
import CustomError from '../errors/CustomError';
import { send } from 'process';

chai.use(chaiHttp);

const { expect } = chai;


describe('Rota /teams', () => {
  const teams = [
    {
      id: 1,
      teamName: 'Avaí/Kindermann'
    },
    {
      id: 2,
      teamName: 'Bahia'
    },
    {
      id: 3,
      teamName: 'Botafogo'
    }
  ]

  describe('GET', () => {
    describe('Caso ok', () => {
      before(() => {
        Sinon.stub(Teams, 'findAll').resolves(teams as Teams[]);
      })

      after(() => {
        (Teams.findAll as Sinon.SinonStub).restore();
      })

      it('retorna status 200 e todos os times', async () => {
        const response: Response = await chai.request(app)
          .get('/teams')

        expect(response.status).to.be.equal(200);
        expect(response.body).to.deep.equal(teams);
      })
    })
  })
})

describe('Rota /teams/:id', () => {
  const team = {
    id: 1,
    teamName: "Avaí/Kindermann"
  }

  describe('GET', () => {
    describe('Caso ok', () => {
      before(() => {
        Sinon.stub(Teams, 'findByPk').resolves(team as Teams);
    })

    after(() => {
      (Teams.findByPk as Sinon.SinonStub).restore();
    })

    it('retorna status 200 e o time referente ao id informado', async () => {
      const response: Response = await chai.request(app)
        .get('/teams/1');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal(team);
    })
  })
})
})