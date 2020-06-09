import { Controller, Get, Body } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("votes")
@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Get()
  async vote(@Body() voteDto: VoteDto) {
    this.votesService.vote(voteDto);
  }
}
