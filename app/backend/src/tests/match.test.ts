import * as chai from 'chai';
import * as Sinon from 'sinon';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import Matches from '../database/models/Match';
import { Response } from 'superagent';
import CustomError from '../errors/CustomError';
import { send } from 'process';

chai.use(chaiHttp);

const { expect } = chai;


describe('Rota /matches', () => {
  describe('GET', () => {
    const matches = [
    {
      "id": 1,
      "homeTeam": 16,
      "homeTeamGoals": 1,
      "awayTeam": 8,
      "awayTeamGoals": 1,
      "inProgress": 0,
      "teamHome": {
        "teamName": "São Paulo"
      },
      "teamAway": {
        "teamName": "Grêmio"
      }
    },
    {
      "id": 2,
      "homeTeam": 9,
      "homeTeamGoals": 1,
      "awayTeam": 14,
      "awayTeamGoals": 1,
      "inProgress": 0,
      "teamHome": {
        "teamName": "Internacional"
      },
      "teamAway": {
        "teamName": "Santos"
      }
    },
    {
      "id": 3,
      "homeTeam": 4,
      "homeTeamGoals": 3,
      "awayTeam": 11,
      "awayTeamGoals": 0,
      "inProgress": 0,
      "teamHome": {
        "teamName": "Corinthians"
      },
      "teamAway": {
        "teamName": "Napoli-SC"
      }
    }
    ]

    describe('Caso ok', () => {
      before(() => {
        Sinon.stub(Matches, 'findAll').resolves(matches as Matches[]);
      })

      after(() => {
        (Matches.findAll as Sinon.SinonStub).restore();
      })

      it('retorna status 200 e todas as partidas', async () => {
        const response: Response = await chai.request(app)
          .get('/matches')

        expect(response.status).to.be.equal(200);
        expect(response.body).to.deep.equal(matches);
      })
    })

    describe('Caso inProgress seja true', () => {
      const matches = [
        {
          "id": 41,
          "homeTeam": 16,
          "homeTeamGoals": 2,
          "awayTeam": 9,
          "awayTeamGoals": 0,
          "inProgress": 1,
          "teamHome": {
            "teamName": "São Paulo"
          },
          "teamAway": {
            "teamName": "Internacional"
          }
        },
        {
          "id": 42,
          "homeTeam": 6,
          "homeTeamGoals": 1,
          "awayTeam": 1,
          "awayTeamGoals": 0,
          "inProgress": 1,
          "teamHome": {
            "teamName": "Ferroviária"
          },
          "teamAway": {
            "teamName": "Avaí/Kindermann"
          }
        },
        {
          "id": 43,
          "homeTeam": 11,
          "homeTeamGoals": 0,
          "awayTeam": 10,
          "awayTeamGoals": 0,
          "inProgress": 1,
          "teamHome": {
            "teamName": "Napoli-SC"
          },
          "teamAway": {
            "teamName": "Minas Brasília"
          }
        }
      ]
      
      before(() => {
        Sinon.stub(Matches, 'findAll').resolves(matches as Matches[]);
      })

      after(() => {
        (Matches.findAll as Sinon.SinonStub).restore();
      })

      it('retorna status 200 e todas as partidas em progresso', async () => {
        const response: Response = await chai.request(app)
          .get('/matches?inProgress=true')

        expect(response.status).to.be.equal(200);
        expect(response.body).to.deep.equal(matches);
      })
    })

    describe('Caso inProgress seja false', () => {
      const matches = [
        {
          "id": 41,
          "homeTeam": 16,
          "homeTeamGoals": 2,
          "awayTeam": 9,
          "awayTeamGoals": 0,
          "inProgress": 0,
          "teamHome": {
            "teamName": "São Paulo"
          },
          "teamAway": {
            "teamName": "Internacional"
          }
        },
        {
          "id": 42,
          "homeTeam": 6,
          "homeTeamGoals": 1,
          "awayTeam": 1,
          "awayTeamGoals": 0,
          "inProgress": 0,
          "teamHome": {
            "teamName": "Ferroviária"
          },
          "teamAway": {
            "teamName": "Avaí/Kindermann"
          }
        },
        {
          "id": 43,
          "homeTeam": 11,
          "homeTeamGoals": 0,
          "awayTeam": 10,
          "awayTeamGoals": 0,
          "inProgress": 0,
          "teamHome": {
            "teamName": "Napoli-SC"
          },
          "teamAway": {
            "teamName": "Minas Brasília"
          }
        }
      ]
      
      before(() => {
        Sinon.stub(Matches, 'findAll').resolves(matches as Matches[]);
      })

      after(() => {
        (Matches.findAll as Sinon.SinonStub).restore();
      })

      it('retorna status 200 e todas as partidas finalizadas', async () => {
        const response: Response = await chai.request(app)
          .get('/matches?inProgress=false')

        expect(response.status).to.be.equal(200);
        expect(response.body).to.deep.equal(matches);
      })
    })
  })

  // describe('POST'), () => {
  //   const match = {
  //     id: 49,
  //     homeTeam: 16,
  //     homeTeamGoals: 2,
  //     awayTeam: 8,
  //     awayTeamGoals: 2,
  //     inProgress: 1,
  //   }

  //   describe('Caso partida criada com sucesso', async () => {
  //     before(() => {
  //       Sinon.stub(Matches, 'create').resolves();
  //       Sinon.stub(Matches, 'findByPk').resolves(match as Matches);
  //     })

  //     after(() => {
  //       (Matches.create as Sinon.SinonStub).restore();
  //       (Matches.findByPk as Sinon.SinonStub).restore();
  //     })

  //     it('Retorna status 201 e as informações da partida criada', async () => {
  //       const response: Response = await chai.request(app)
  //         .post('/matches')
  //         .send({ homeTeam: 16, awayTeam: 8, homeTeamGoals: 2, awayTeamGoals: 2, inProgress: true })
  //         .set({'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTY2NDgxNzUwNywiZXhwIjoxNjY0OTAzOTA3fQ.mSEK9ndX-k4i85QDOsk0TSnjgkQM6S-lKKsmstdQJ-8'})
    

  //       expect(response.status).to.be.equal(201);
  //       expect(response.body).to.deep.equal(match);
  //     })
  //   })
  // }
})

describe('Rota /matches/:id/finish', () => {
  describe('PATCH', () => {
    const match = {
      "id": 1,
      "homeTeam": 16,
      "homeTeamGoals": 3,
      "awayTeam": 8,
      "awayTeamGoals": 1,
      "inProgress": 0,
      "teamHome": {
        "teamName": "São Paulo"
      },
      "teamAway": {
        "teamName": "Grêmio"
      }
    }

    before(() => {
      Sinon.stub(Matches, 'findByPk').resolves(match as Matches);
      Sinon.stub(Matches, 'update').resolves();
    })

    after(() => {
      (Matches.findByPk as Sinon.SinonStub).restore();
      (Matches.update as Sinon.SinonStub).restore();
    })

    it('retorna status 200 e a mensagem de partida finalizada', async () => {
      const response: Response = await chai.request(app)
        .patch('/matches/1/finish')

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ message: 'Finished' });
    })

  })
})