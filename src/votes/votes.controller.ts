import { Controller, Get, Body, ValidationPipe } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { ApiHeaders } from 'src/decorators/api';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @ApiHeaders()
  @Get()
  async vote(@Body(new ValidationPipe({transform: true})) voteDto: VoteDto) {
    this.votesService.vote(voteDto);
  }
}
